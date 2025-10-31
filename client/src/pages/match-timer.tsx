import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import type { PreMatchForm } from "@shared/schema";

export default function MatchTimerPage() {
  const [, setLocation] = useLocation();
  const [preMatchData, setPreMatchData] = useState<PreMatchForm | null>(null);
  
  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [matchPhase, setMatchPhase] = useState<"first_half" | "halftime" | "second_half" | "complete">("first_half");
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // Scores
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  
  // Stoppage time tracking
  const [firstHalfStoppageSeconds, setFirstHalfStoppageSeconds] = useState(0);
  const [secondHalfStoppageSeconds, setSecondHalfStoppageSeconds] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [inStoppageTime, setInStoppageTime] = useState(false);
  const [stoppageElapsed, setStoppageElapsed] = useState(0);
  
  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "warning" | "question";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const stored = localStorage.getItem("preMatchData");
    if (stored) {
      setPreMatchData(JSON.parse(stored));
    } else {
      setLocation("/");
    }
  }, [setLocation]);
  
  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused && countdown === null) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1;
          
          // Check for half-time (45:00 = 2700 seconds)
          if (next === 2700 && matchPhase === "first_half" && firstHalfStoppageSeconds === 0) {
            setIsRunning(false);
            setMatchPhase("halftime");
            return next;
          }
          
          // Check for end of match (90:00 = 5400 seconds)
          if (next === 5400 && matchPhase === "second_half" && secondHalfStoppageSeconds === 0) {
            setIsRunning(false);
            setMatchPhase("complete");
            return next;
          }
          
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, countdown, matchPhase, firstHalfStoppageSeconds, secondHalfStoppageSeconds]);
  
  // Stoppage time effect
  useEffect(() => {
    if (inStoppageTime && isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setStoppageElapsed(prev => {
          const next = prev + 1;
          const totalStoppage = matchPhase === "first_half" ? firstHalfStoppageSeconds : secondHalfStoppageSeconds;
          
          if (next >= totalStoppage) {
            setInStoppageTime(false);
            setIsRunning(false);
            
            if (matchPhase === "first_half") {
              setMatchPhase("halftime");
            } else {
              setMatchPhase("complete");
            }
            
            return next;
          }
          
          return next;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [inStoppageTime, isRunning, isPaused, matchPhase, firstHalfStoppageSeconds, secondHalfStoppageSeconds]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const startCountdown = (callback: () => void) => {
    setCountdown(3);
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        setCountdown(null);
        clearInterval(countdownInterval);
        callback();
      }
    }, 1000);
  };
  
  const handleStart = () => {
    setConfirmDialog({
      open: true,
      title: "Start Timer",
      description: "Are you sure you want to START the timer?",
      onConfirm: () => {
        if (matchPhase === "halftime") {
          startCountdown(() => {
            setMatchPhase("second_half");
            setIsRunning(true);
            setIsPaused(false);
          });
        } else if (!isRunning && matchPhase === "first_half" && elapsedSeconds === 0) {
          startCountdown(() => {
            setIsRunning(true);
            setIsPaused(false);
          });
        } else if (elapsedSeconds === 2700 && firstHalfStoppageSeconds > 0 && !inStoppageTime) {
          setInStoppageTime(true);
          setStoppageElapsed(0);
          setIsRunning(true);
          setIsPaused(false);
        } else if (elapsedSeconds === 5400 && secondHalfStoppageSeconds > 0 && !inStoppageTime) {
          setInStoppageTime(true);
          setStoppageElapsed(0);
          setIsRunning(true);
          setIsPaused(false);
        } else {
          setIsRunning(true);
          setIsPaused(false);
          
          if (pauseStartTime !== null) {
            const pauseDuration = Math.floor((Date.now() - pauseStartTime) / 1000);
            if (matchPhase === "first_half") {
              setFirstHalfStoppageSeconds(prev => prev + pauseDuration);
            } else if (matchPhase === "second_half") {
              setSecondHalfStoppageSeconds(prev => prev + pauseDuration);
            }
            setPauseStartTime(null);
          }
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };
  
  const handlePause = () => {
    setConfirmDialog({
      open: true,
      title: "Pause Timer",
      description: "Are you sure you want to PAUSE the timer?",
      onConfirm: () => {
        setIsRunning(false);
        setIsPaused(true);
        setPauseStartTime(Date.now());
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };
  
  const handleReset = () => {
    setConfirmDialog({
      open: true,
      title: "Reset Timer",
      description: "Are you sure you want to RESET the timer? All timer logs will be cleared.",
      variant: "warning",
      onConfirm: () => {
        setElapsedSeconds(0);
        setIsRunning(false);
        setIsPaused(false);
        setMatchPhase("first_half");
        setFirstHalfStoppageSeconds(0);
        setSecondHalfStoppageSeconds(0);
        setPauseStartTime(null);
        setInStoppageTime(false);
        setStoppageElapsed(0);
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };
  
  const handleScoreChange = (team: "home" | "away", change: number) => {
    const currentScore = team === "home" ? homeScore : awayScore;
    const newScore = Math.max(0, currentScore + change);
    const teamName = team === "home" ? preMatchData?.homeTeam : preMatchData?.awayTeam;
    const action = change > 0 ? "Increase" : "Decrease";
    
    setConfirmDialog({
      open: true,
      title: `${action} Score`,
      description: `${action} ${teamName} score to ${newScore} at match time ${formatTime(elapsedSeconds)}?`,
      onConfirm: () => {
        if (team === "home") {
          setHomeScore(newScore);
        } else {
          setAwayScore(newScore);
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };
  
  const getPhaseLabel = () => {
    if (matchPhase === "first_half") return "1st Half";
    if (matchPhase === "halftime") return "Half-Time";
    if (matchPhase === "second_half") return "2nd Half";
    return "Match Complete";
  };
  
  const displayTime = inStoppageTime ? stoppageElapsed : elapsedSeconds;
  const isHalfTime = matchPhase === "halftime";
  const isComplete = matchPhase === "complete";
  
  if (!preMatchData) return null;
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        {/* Match Phase Badge */}
        <div className="mb-8 text-center">
          <Badge 
            className="px-6 py-2 text-sm font-semibold uppercase tracking-wide"
            variant={isComplete ? "default" : "secondary"}
            data-testid="badge-match-phase"
          >
            {getPhaseLabel()}
          </Badge>
        </div>
        
        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95">
            <div className="text-9xl font-black tabular-nums text-primary" data-testid="text-countdown">
              {countdown}
            </div>
          </div>
        )}
        
        {/* Halftime Message */}
        {isHalfTime && (
          <div className="mb-8">
            <Card className="border-2 border-primary bg-primary/5 p-8">
              <p className="text-center text-2xl font-bold uppercase tracking-wide text-primary">
                Starts Second Half
              </p>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Press START to begin countdown
              </p>
            </Card>
          </div>
        )}
        
        {/* Match Complete Message */}
        {isComplete && (
          <div className="mb-8">
            <Card className="border-2 border-primary bg-primary/5 p-8">
              <p className="text-center text-2xl font-bold uppercase tracking-wide text-primary">
                Match Complete
              </p>
              <div className="mt-6 text-center">
                <Button
                  size="lg"
                  onClick={() => {
                    localStorage.setItem("matchComplete", "true");
                    localStorage.setItem("finalScores", JSON.stringify({ homeScore, awayScore }));
                    localStorage.setItem("elapsedTime", elapsedSeconds.toString());
                    localStorage.setItem("firstHalfStoppage", firstHalfStoppageSeconds.toString());
                    localStorage.setItem("secondHalfStoppage", secondHalfStoppageSeconds.toString());
                    setLocation("/report");
                  }}
                  className="h-12 px-8"
                  data-testid="button-view-report"
                >
                  View Match Report
                </Button>
              </div>
            </Card>
          </div>
        )}
        
        {/* Scoreboard */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-3 items-center gap-4 p-6">
              {/* Home Team */}
              <div className="flex flex-col items-center text-center">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Home
                </p>
                <p className="mb-3 truncate text-lg font-semibold" data-testid="text-home-team">
                  {preMatchData.homeTeam}
                </p>
                <div className="mb-3 text-5xl font-bold tabular-nums" data-testid="text-home-score">
                  {homeScore}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleScoreChange("home", -1)}
                    disabled={homeScore === 0}
                    data-testid="button-home-minus"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleScoreChange("home", 1)}
                    data-testid="button-home-plus"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Timer */}
              <div className="flex flex-col items-center">
                <div 
                  className={`text-6xl font-bold tabular-nums ${inStoppageTime ? "text-destructive" : "text-foreground"}`}
                  data-testid="text-timer"
                >
                  {formatTime(displayTime)}
                </div>
                {inStoppageTime && (
                  <p className="mt-2 text-sm font-semibold text-destructive">
                    +{formatTime(stoppageElapsed)} Stoppage
                  </p>
                )}
              </div>
              
              {/* Away Team */}
              <div className="flex flex-col items-center text-center">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Away
                </p>
                <p className="mb-3 truncate text-lg font-semibold" data-testid="text-away-team">
                  {preMatchData.awayTeam}
                </p>
                <div className="mb-3 text-5xl font-bold tabular-nums" data-testid="text-away-score">
                  {awayScore}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleScoreChange("away", -1)}
                    disabled={awayScore === 0}
                    data-testid="button-away-minus"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleScoreChange("away", 1)}
                    data-testid="button-away-plus"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Timer Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          {!isRunning || isPaused ? (
            <Button
              size="lg"
              className="h-20 min-w-32 text-lg font-bold uppercase"
              onClick={handleStart}
              disabled={isComplete}
              data-testid="button-start"
            >
              <Play className="mr-2 h-5 w-5" />
              Start
            </Button>
          ) : (
            <Button
              size="lg"
              variant="secondary"
              className="h-20 min-w-32 text-lg font-bold uppercase"
              onClick={handlePause}
              data-testid="button-pause"
            >
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          )}
          
          <Button
            size="lg"
            variant="outline"
            className="h-20 min-w-32 text-lg font-bold uppercase"
            onClick={handleReset}
            data-testid="button-reset"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>
        
        {/* Stoppage Time Info */}
        {(firstHalfStoppageSeconds > 0 || secondHalfStoppageSeconds > 0) && (
          <div className="mt-8">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Stoppage Time</h3>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                {firstHalfStoppageSeconds > 0 && (
                  <div>
                    <span className="font-medium">1st Half: </span>
                    <span className="tabular-nums">{formatTime(firstHalfStoppageSeconds)}</span>
                  </div>
                )}
                {secondHalfStoppageSeconds > 0 && (
                  <div>
                    <span className="font-medium">2nd Half: </span>
                    <span className="tabular-nums">{formatTime(secondHalfStoppageSeconds)}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
      
      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
      />
    </div>
  );
}
