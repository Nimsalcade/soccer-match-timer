import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { preMatchFormSchema, type PreMatchForm } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Trophy, Users } from "lucide-react";

export default function PreMatchFormPage() {
  const [, setLocation] = useLocation();

  const getDefaultValues = () => ({
    refereeName: "",
    assistantReferee1: "",
    assistantReferee2: "",
    fourthOfficial: "",
    matchDate: new Date().toISOString().split("T")[0],
    kickoffTime: "",
    venue: "",
    competition: "",
    matchNumber: "",
    homeTeam: "",
    awayTeam: "",
    preMatchNotes: "",
  });

  const form = useForm<PreMatchForm>({
    resolver: zodResolver(preMatchFormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    // Reset form when returning from "Start New Match"
    const matchComplete = localStorage.getItem("matchComplete");
    if (matchComplete === null || matchComplete === "") {
      form.reset(getDefaultValues());
    }
  }, [form]);

  const onSubmit = (data: PreMatchForm) => {
    localStorage.setItem("preMatchData", JSON.stringify(data));
    setLocation("/timer");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Soccer Match Timer
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Pre-Match Information Form
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Match Officials Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-5 w-5 text-primary" />
                  Match Officials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="refereeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referee Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter referee name" 
                          className="h-12 text-base"
                          data-testid="input-referee-name"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assistantReferee1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assistant Referee 1</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter AR1 name" 
                          className="h-12 text-base"
                          data-testid="input-ar1"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assistantReferee2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assistant Referee 2</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter AR2 name" 
                          className="h-12 text-base"
                          data-testid="input-ar2"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fourthOfficial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fourth Official (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter fourth official name" 
                          className="h-12 text-base"
                          data-testid="input-fourth-official"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Match Information Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Trophy className="h-5 w-5 text-primary" />
                  Match Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="matchDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Match Date
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="h-12 text-base"
                            data-testid="input-match-date"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kickoffTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Scheduled Kickoff Time
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            className="h-12 text-base"
                            data-testid="input-kickoff-time"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Venue
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter stadium/field name" 
                          className="h-12 text-base"
                          data-testid="input-venue"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competition</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter league/tournament name" 
                          className="h-12 text-base"
                          data-testid="input-competition"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matchNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Match Number (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter match ID" 
                          className="h-12 text-base"
                          data-testid="input-match-number"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Team Information Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="homeTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Team</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter home team name" 
                          className="h-12 text-base"
                          data-testid="input-home-team"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="awayTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Away Team</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter away team name" 
                          className="h-12 text-base"
                          data-testid="input-away-team"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Additional Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="preMatchNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pre-Match Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Weather conditions, field conditions, special circumstances..."
                          className="min-h-24 resize-none text-base"
                          maxLength={500}
                          data-testid="input-pre-match-notes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/500 characters
                      </p>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="h-14 w-full text-lg font-semibold uppercase tracking-wide"
                disabled={!form.formState.isValid && form.formState.isSubmitted}
                data-testid="button-start-match"
              >
                Start Match
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
