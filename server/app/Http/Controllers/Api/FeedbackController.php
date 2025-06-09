<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Google\Client;
use Google\Service\Sheets;

class FeedbackController extends Controller
{
    public function getResponses()
    {
        $client = new Client();
        $client->setAuthConfig(storage_path('app/GsheetsKey.json')); // Your service account JSON
        $client->addScope(Sheets::SPREADSHEETS_READONLY);

        $service = new Sheets($client);
        $spreadsheetId = '1lf77YXjgwJ2Z83tYQPvDjrUc_hZrU7FSOybcnQIKkkk'; // Your Google Sheet ID
        $range = "Form Responses 1!A1:Z1000"; // Adjust as needed

        $response = $service->spreadsheets_values->get($spreadsheetId, $range);
        $values = $response->getValues();

        return response()->json($values);
    }

    public function getSurveyQuestions()
    {
        return response()->json([
            'questions' => [
                [
                    'text' => 'The POS system is easy to use and user-friendly.',
                    'type' => 'multiple-choice',
                    'choices' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                ],
                [
                    'text' => 'The system responds quickly without significant delays.',
                    'type' => 'multiple-choice',
                    'choices' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                ],
                [
                    'text' => 'It is easy to train new staff to use the POS system.',
                    'type' => 'multiple-choice',
                    'choices' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                ],
                [
                    'text' => 'The POS system helps improve our transaction accuracy.',
                    'type' => 'multiple-choice',
                    'choices' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                ],
                [
                    'text' => 'I am satisfied with the reliability and stability of the system.',
                    'type' => 'multiple-choice',
                    'choices' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                ],
                [
                    'text' => 'The features of the POS system meet the needs of our business.',
                    'type' => 'multiple-choice',
                    'choices' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                ],
                [
                    'text' => 'The system integrates well with our inventory and reporting tools.',
                    'type' => 'multiple-choice',
                    'choices' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                ],
                [
                    'text' => 'Customer transactions are processed efficiently using the POS.',
                    'type' => 'multiple-choice',
                    'choices' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                ],
                [
                    'text' => 'Technical support is responsive and helpful when issues arise.',
                    'type' => 'multiple-choice',
                    'choices' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                ],
                [
                    'text' => 'I would recommend this POS system to other businesses.',
                    'type' => 'multiple-choice',
                    'choices' => ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                ],
                [
                    'text' => 'What suggestions do you have for improving the POS system to better serve your needs?',
                    'type' => 'text'
                ]
            ]

        ]);
    }
    public function getAggregatedResponses()
    {
        $client = new Client();
        $client->setAuthConfig(storage_path('app/GsheetsKey.json'));
        $client->addScope(Sheets::SPREADSHEETS_READONLY);
        $service = new Sheets($client);
        $spreadsheetId = '1lf77YXjgwJ2Z83tYQPvDjrUc_hZrU7FSOybcnQIKkkk';
        $range = "Form Responses 1!A1:Z1000";

        $response = $service->spreadsheets_values->get($spreadsheetId, $range);
        $values = $response->getValues();


        if (empty($values)) {
            return response()->json(['error' => 'No data found'], 404);
        }

        $headers = $values[0];
        $dataRows = array_slice($values, 1);

        $summary = [];

        foreach ($headers as $colIndex => $question) {
            // Skip timestamp column (usually index 0)
            if ($colIndex === 0) {
                continue;
            }

            $summary[$question] = [];
            foreach ($dataRows as $row) {
                $answer = $row[$colIndex] ?? null;
                if ($answer) {
                    if (!isset($summary[$question][$answer])) {
                        $summary[$question][$answer] = 0;
                    }
                    $summary[$question][$answer]++;
                }
            }
        }

        return response()->json($summary);
    }

}
