<?php

namespace App\Orchid\Screens;

use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Quill;
use Orchid\Screen\Fields\Relation;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Alert;
use Orchid\Support\Facades\Layout;
use ExpoSDK\Expo;
use ExpoSDK\ExpoMessage;

class NotificationSenderScreen extends Screen
{
    /**
     * Query data.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [];
    }

    /**
     * Display header name.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Уведомления';
    }

    /**
     * Display header description.
     *
     * @return string|null
     */
    public function description(): ?string
    {
        return 'Отправка уведомлений';
    }

    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [
            Button::make('Отправить')
                ->icon('paper-plane')
                ->method('sendMessage')
        ];
    }

    /**
     * Views.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): iterable
    {
        return [
            Layout::rows([
                Input::make('title')
                    ->title('Заголовок')
                    ->required()
                    ->placeholder('...')
                    ->help('Enter the subject line for your message'),

                TextArea::make('message')
                    ->title('Сообщение')
                    ->rows(20)
                    ->placeholder('...'),
            ])
        ];
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sendMessage(Request $request)
    {
        $expo = Expo::driver('file');

        $messages = [
            [
                'title' => 'Test notification',
                'to' => 'ExponentPushToken[xxxx-xxxx-xxxx]',
            ],
            new ExpoMessage([
                'title' => 'Notification for default recipients',
                'body' => 'Because "to" property is not defined',
            ]),
        ];

        $defaultRecipients = [
            'ExponentPushToken[VsZhevMauXtqrYZ0jIGNw_]'
        ];

        $expo->send($messages)->to($defaultRecipients)->push();

        Alert::info('Your email message has been sent successfully.');
    }
}
