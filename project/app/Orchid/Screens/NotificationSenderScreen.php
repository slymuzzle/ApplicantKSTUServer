<?php

namespace App\Orchid\Screens;

use Illuminate\Http\Request;
use Kreait\Firebase\Messaging\AndroidConfig;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Quill;
use Orchid\Screen\Fields\Relation;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Alert;
use Orchid\Support\Facades\Layout;
use Kreait\Firebase\Messaging\CloudMessage;

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
                    ->placeholder('...'),

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
        $messaging = app('firebase.messaging');

        $topic = 'all';

        $config = AndroidConfig::fromArray([
            'notification' => [
                'icon' => 'notification_icon',
            ],
        ]);

        $message = CloudMessage::withTarget('topic', $topic)
            ->withNotification([
                'title' => $request->get('title'),
                'body' => $request->get('message')
            ])
            ->withHighestPossiblePriority()
            ->withDefaultSounds()
            ->withAndroidConfig($config);

        $messaging->send($message);
    }
}
