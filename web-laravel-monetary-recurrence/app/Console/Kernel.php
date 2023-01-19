<?php

namespace App\Console;

use App\Models\Recurrence;
use App\Models\RecurrenceTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Output\ConsoleOutput;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $today = Carbon::today();
            $recurrences = Recurrence::query()->where('automatic', true)->get();
            foreach ($recurrences as $recurrence) {
                $nextDate = Carbon::parse($recurrence->period_start_date);
                $count = 0;
                do {
                    $count++;
                    switch ($recurrence->period_type) {
                        case "Day":
                            $nextDate->addDays($recurrence->period_interval);
                            break;
                        case "Week":
                            $nextDate->addWeeks($recurrence->period_interval);
                            break;
                        case "Month":
                            $nextDate->addMonths($recurrence->period_interval);
                            break;
                        case "Year":
                            $nextDate->addYears($recurrence->period_interval);
                            break;
                    }
                    if ($nextDate->eq($today)) {
                        $transaction_id = \Ramsey\Uuid\Uuid::uuid4()->toString();
                        (new ConsoleOutput)->writeln('Inserting transaction ' . $transaction_id . ' for recurrence ' . $recurrence->id . ' on ' . $nextDate->toDateString());
                        DB::table('transactions')->insert([
                            'id' => $transaction_id,
                            'user_id' => $recurrence->user_id,
                            'category_id' => $recurrence->category_id,
                            'from_account_id' => $recurrence->from_account_id,
                            'to_account_id' => $recurrence->to_account_id,
                            'type' => $recurrence->type,
                            'amount' => $recurrence->amount,
                            'date' => $nextDate,
                            'description' => $recurrence->description,
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]);
                        RecurrenceTransactions::create([
                            'recurrence_id' => $recurrence->id,
                            'transaction_id' => $transaction_id,
                        ]);
                        break;
                    }
                } while (
                    $nextDate->lt($today) &&
                    (isset($recurrence->period_end_date) ? $nextDate->lt($recurrence->period_end_date) : true) &&
                    (isset($recurrence->period_end_count) ? $count < $recurrence->period_end_count : true)
                );
            }
        })->dailyAt('00:00');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}