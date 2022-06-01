<?php

declare(strict_types=1);

namespace App\Orchid\Screens\User;

use App\Orchid\Layouts\User\ProfilePasswordLayout;
use App\Orchid\Layouts\User\UserEditLayout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Orchid\Platform\Models\User;
use Orchid\Screen\Action;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class UserProfileScreen extends Screen
{
    /**
     * Query data.
     *
     * @param Request $request
     *
     * @return array
     */
    public function query(Request $request): iterable
    {
        return [
            'user' => $request->user(),
        ];
    }

    /**
     * Display header name.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Мой профиль';
    }

    /**
     * Display header description.
     *
     * @return string|null
     */
    public function description(): ?string
    {
        return 'Обновить данные своей учетной записи, такие как имя, адрес электронной почты и пароль';
    }

    /**
     * Button commands.
     *
     * @return Action[]
     */
    public function commandBar(): iterable
    {
        return [];
    }

    /**
     * @return \Orchid\Screen\Layout[]
     */
    public function layout(): iterable
    {
        return [
            Layout::block(UserEditLayout::class)
                ->title(__('Информация о профиле'))
                ->description(__("Обновите информацию профиля своей учетной записи и адрес электронной почты."))
                ->commands(
                    Button::make(__('Сохранить'))
                        ->type(Color::DEFAULT())
                        ->icon('check')
                        ->method('save')
                ),

            Layout::block(ProfilePasswordLayout::class)
                ->title(__('Обновить пароль'))
                ->description(__('Убедитесь, что ваша учетная запись использует длинный, случайный пароль, чтобы оставаться в безопасности.'))
                ->commands(
                    Button::make(__('Обновить пароль'))
                        ->type(Color::DEFAULT())
                        ->icon('check')
                        ->method('changePassword')
                ),
        ];
    }

    /**
     * @param Request $request
     */
    public function save(Request $request): void
    {
        $request->validate([
            'user.name'  => 'required|string',
            'user.email' => [
                'required',
                Rule::unique(User::class, 'email')->ignore($request->user()),
            ],
        ]);

        $request->user()
            ->fill($request->get('user'))
            ->save();

        Toast::info(__('Profile updated.'));
    }

    /**
     * @param Request $request
     */
    public function changePassword(Request $request): void
    {
        $request->validate([
            'old_password' => 'required|password:web',
            'password'     => 'required|confirmed',
        ]);

        tap($request->user(), function ($user) use ($request) {
            $user->password = Hash::make($request->get('password'));
        })->save();

        Toast::info(__('Password changed.'));
    }
}
