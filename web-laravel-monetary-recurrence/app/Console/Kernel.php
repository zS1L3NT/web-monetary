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
            $today = Carbon::today('Asia/Singapore');
            (new ConsoleOutput)->writeln(['today' => $today->toDateTimeString(), 'time' => Carbon::now('Asia/Singapore')->toDateTimeString()]);
            $recurrences = Recurrence::query()->where('automatic', true)->get();
            foreach ($recurrences as $recurrence) {
                (new ConsoleOutput)->writeln(['recurrence' => json_encode($recurrence)]);
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
                    (new ConsoleOutput)->writeln(['nextDate' => $nextDate->toDateTimeString(), 'count' => $count]);
                    if ($nextDate->equalTo($today)) {
                        $transaction_id = \Ramsey\Uuid\Uuid::uuid4()->toString();
                        (new ConsoleOutput)->writeln(['transaction_id' => $transaction_id]);
                        DB::table('transactions')->insert([
                            'id' => $transaction_id,
                            'user_id' => $recurrence->user_id,
                            'category_id' => $recurrence->category_id,
                            'from_account_id' => $recurrence->account_id,
                            'to_account_id' => $recurrence->to_account_id,
                            'type' => $recurrence->type,
                            'amount' => $recurrence->amount,
                            'date' => $nextDate,
                            'description' => $recurrence->description,
                        ]);
                        RecurrenceTransactions::create([
                            'recurrence_id' => $recurrence->id,
                            'transaction_id' => $transaction_id,
                        ]);
                        (new ConsoleOutput)->writeln('Success!');
                        break;
                    }
                } while ($nextDate < $today && $count < $recurrence->period_end_count);
            }
        })->dailyAt('00:00')->timezone('Asia/Singapore');
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