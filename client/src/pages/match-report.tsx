import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Download, FileText, RefreshCw } from "lucide-react";
import type { PreMatchForm } from "@shared/schema";

export default function MatchReportPage() {
  const [, setLocation] = useLocation();
  const [preMatchData, setPreMatchData] = useState<PreMatchForm | null>(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [firstHalfStoppage, setFirstHalfStoppage] = useState(0);
  const [secondHalfStoppage, setSecondHalfStoppage] = useState(0);
  const [postMatchNotes, setPostMatchNotes] = useState("");
  const [showNewMatchDialog, setShowNewMatchDialog] = useState(false);
  
  useEffect(() => {
    const stored = localStorage.getItem("preMatchData");
    const complete = localStorage.getItem("matchComplete");
    const scores = localStorage.getItem("finalScores");
    const elapsed = localStorage.getItem("elapsedTime");
    const firstStoppage = localStorage.getItem("firstHalfStoppage");
    const secondStoppage = localStorage.getItem("secondHalfStoppage");
    
    if (stored && complete === "true") {
      setPreMatchData(JSON.parse(stored));
      if (scores) {
        const parsedScores = JSON.parse(scores);
        setHomeScore(parsedScores.homeScore);
        setAwayScore(parsedScores.awayScore);
      }
      if (elapsed) setElapsedTime(parseInt(elapsed));
      if (firstStoppage) setFirstHalfStoppage(parseInt(firstStoppage));
      if (secondStoppage) setSecondHalfStoppage(parseInt(secondStoppage));
    } else {
      setLocation("/");
    }
  }, [setLocation]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const formatTimeWithHours = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const generateMainReport = () => {
    if (!preMatchData) return;
    
    const date = new Date().toISOString();
    const matchDate = new Date(preMatchData.matchDate);
    const formattedDate = matchDate.toISOString().split("T")[0];
    
    const csv = [
      "MATCH REPORT",
      `Report Generated,${date}`,
      "",
      "MATCH INFORMATION",
      `Match Date,${formattedDate}`,
      `Kickoff Time,${preMatchData.kickoffTime}`,
      `Venue,${preMatchData.venue}`,
      `Competition,${preMatchData.competition}`,
      `Match Number,${preMatchData.matchNumber || "N/A"}`,
      "",
      "TEAMS",
      `Home Team,${preMatchData.homeTeam}`,
      `Away Team,${preMatchData.awayTeam}`,
      `Final Score,${homeScore}-${awayScore}`,
      "",
      "MATCH OFFICIALS",
      `Referee,${preMatchData.refereeName}`,
      `Assistant Referee 1,${preMatchData.assistantReferee1}`,
      `Assistant Referee 2,${preMatchData.assistantReferee2}`,
      `Fourth Official,${preMatchData.fourthOfficial || "N/A"}`,
      "",
      "MATCH TIMELINE",
      `Scheduled Kickoff Time,${preMatchData.kickoffTime}`,
      `First Half Duration,45:00 + ${formatTime(firstHalfStoppage)} stoppage`,
      `Second Half Duration,45:00 + ${formatTime(secondHalfStoppage)} stoppage`,
      `Total Match Duration,${formatTimeWithHours(elapsedTime + firstHalfStoppage + secondHalfStoppage)}`,
      "",
      "STOPPAGE TIME SUMMARY",
      `First Half Stoppage,${formatTime(firstHalfStoppage)}`,
      `Second Half Stoppage,${formatTime(secondHalfStoppage)}`,
      `Total Stoppage,${formatTime(firstHalfStoppage + secondHalfStoppage)}`,
      "",
      "ADDITIONAL NOTES",
      `Pre-Match Notes,${preMatchData.preMatchNotes || "None"}`,
      `Post-Match Notes,${postMatchNotes || "None"}`,
    ].join("\n");
    
    const filename = `Match_Report_${preMatchData.homeTeam.replace(/\s+/g, "_")}_vs_${preMatchData.awayTeam.replace(/\s+/g, "_")}_${formattedDate.replace(/-/g, "")}.csv`;
    downloadCSV(csv, filename);
  };
  
  const generateDetailedLog = () => {
    if (!preMatchData) return;
    
    const formattedDate = new Date(preMatchData.matchDate).toISOString().split("T")[0];
    
    const csv = [
      "DETAILED MATCH EVENT LOG",
      `Match,${preMatchData.homeTeam} vs ${preMatchData.awayTeam}`,
      `Date,${formattedDate}`,
      "",
      "Event,Match Time,Timestamp,Duration,Notes",
      "Match Start,00:00,--,--,First half begins",
      `First Half End,45:00,--,--,Regulation time`,
      firstHalfStoppage > 0 ? `Stoppage Time End,+${formatTime(firstHalfStoppage)},--,${formatTime(firstHalfStoppage)},First half stoppage` : "",
      "Half-Time,--,--,--,Break between halves",
      "Second Half Start,45:00,--,--,Second half begins",
      `Second Half End,90:00,--,--,Regulation time`,
      secondHalfStoppage > 0 ? `Stoppage Time End,+${formatTime(secondHalfStoppage)},--,${formatTime(secondHalfStoppage)},Second half stoppage` : "",
      "Match Complete,--,--,--,Final whistle",
    ].filter(line => line !== "").join("\n");
    
    const filename = `Match_Log_${preMatchData.homeTeam.replace(/\s+/g, "_")}_vs_${preMatchData.awayTeam.replace(/\s+/g, "_")}_${formattedDate.replace(/-/g, "")}.csv`;
    downloadCSV(csv, filename);
  };
  
  const handleNewMatch = () => {
    localStorage.removeItem("preMatchData");
    localStorage.removeItem("matchComplete");
    localStorage.removeItem("finalScores");
    localStorage.removeItem("elapsedTime");
    localStorage.removeItem("firstHalfStoppage");
    localStorage.removeItem("secondHalfStoppage");
    setLocation("/");
  };
  
  if (!preMatchData) return null;
  
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Match Report Summary
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {preMatchData.homeTeam} vs {preMatchData.awayTeam}
          </p>
        </div>
        
        {/* Match Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Match Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <span className="font-medium">Date: </span>
                <span data-testid="text-match-date">{new Date(preMatchData.matchDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium">Kickoff: </span>
                <span data-testid="text-kickoff-time">{preMatchData.kickoffTime}</span>
              </div>
              <div>
                <span className="font-medium">Venue: </span>
                <span data-testid="text-venue">{preMatchData.venue}</span>
              </div>
              <div>
                <span className="font-medium">Competition: </span>
                <span data-testid="text-competition">{preMatchData.competition}</span>
              </div>
            </div>
            <div className="mt-4 border-t pt-4 text-center">
              <p className="text-lg font-semibold">Final Score</p>
              <p className="mt-2 text-3xl font-bold tabular-nums" data-testid="text-final-score">
                {preMatchData.homeTeam} {homeScore} - {awayScore} {preMatchData.awayTeam}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Match Officials */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Match Officials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Referee: </span>
              <span data-testid="text-referee">{preMatchData.refereeName}</span>
            </div>
            <div>
              <span className="font-medium">Assistant Referee 1: </span>
              <span data-testid="text-ar1">{preMatchData.assistantReferee1}</span>
            </div>
            <div>
              <span className="font-medium">Assistant Referee 2: </span>
              <span data-testid="text-ar2">{preMatchData.assistantReferee2}</span>
            </div>
            {preMatchData.fourthOfficial && (
              <div>
                <span className="font-medium">Fourth Official: </span>
                <span data-testid="text-fourth-official">{preMatchData.fourthOfficial}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Match Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Match Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">First Half Duration: </span>
              <span className="tabular-nums">45:00 + {formatTime(firstHalfStoppage)} stoppage</span>
            </div>
            <div>
              <span className="font-medium">Second Half Duration: </span>
              <span className="tabular-nums">45:00 + {formatTime(secondHalfStoppage)} stoppage</span>
            </div>
            <div>
              <span className="font-medium">Total Match Duration: </span>
              <span className="tabular-nums">
                {formatTimeWithHours(elapsedTime + firstHalfStoppage + secondHalfStoppage)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Stoppage Time Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Stoppage Time Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">First Half Stoppage: </span>
              <span className="tabular-nums">{formatTime(firstHalfStoppage)}</span>
            </div>
            <div>
              <span className="font-medium">Second Half Stoppage: </span>
              <span className="tabular-nums">{formatTime(secondHalfStoppage)}</span>
            </div>
            <div>
              <span className="font-medium">Total Stoppage: </span>
              <span className="tabular-nums">{formatTime(firstHalfStoppage + secondHalfStoppage)}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {preMatchData.preMatchNotes && (
              <div>
                <Label className="text-sm font-medium">Pre-Match Notes</Label>
                <p className="mt-1 text-sm text-muted-foreground" data-testid="text-pre-match-notes">
                  {preMatchData.preMatchNotes}
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="post-match-notes" className="text-sm font-medium">
                Post-Match Notes (Optional)
              </Label>
              <Textarea
                id="post-match-notes"
                placeholder="Incidents, injuries, disciplinary actions, weather changes, etc."
                className="mt-2 min-h-24 text-base"
                maxLength={1000}
                value={postMatchNotes}
                onChange={(e) => setPostMatchNotes(e.target.value)}
                data-testid="input-post-match-notes"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {postMatchNotes.length}/1000 characters
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              size="lg"
              className="h-14 w-full font-semibold"
              onClick={generateMainReport}
              data-testid="button-download-report"
            >
              <Download className="mr-2 h-5 w-5" />
              Download CSV Report
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 w-full font-semibold"
              onClick={generateDetailedLog}
              data-testid="button-download-log"
            >
              <FileText className="mr-2 h-5 w-5" />
              Download Detailed Log
            </Button>
          </div>
          
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-full"
            onClick={() => setShowNewMatchDialog(true)}
            data-testid="button-new-match"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Start New Match
          </Button>
        </div>
      </div>
      
      <ConfirmationDialog
        open={showNewMatchDialog}
        onOpenChange={setShowNewMatchDialog}
        onConfirm={handleNewMatch}
        title="Start New Match"
        description="Start a new match? Current report will only be available if downloaded."
        variant="warning"
      />
    </div>
  );
}
