<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user_super_admin = User::factory()->create([
            'name' => 'superadmin',
            'email' => 'superadmin@gmail.com',
            'password'=> bcrypt('12345678'),
        ]);
        $user_admin = User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'password'=> bcrypt('12345678'),
        ]);
        $super_admin = Role::create(['name' => 'super_admin']);
        $admin = Role::create(['name' => 'admin']);
        $user = Role::create(['name' => 'user']);

        Permission::create(['name' => 'add label']);
        Permission::create(['name' => 'edit label']);
        Permission::create(['name' => 'read label']);
        Permission::create(['name' => 'delete label']);
        Permission::create(['name' => 'add jenis_tanaman']);
        Permission::create(['name' => 'edit jenis_tanaman']);
        Permission::create(['name' => 'read jenis_tanaman']);
        Permission::create(['name' => 'delete jenis_tanaman']);
        $permission_admin = [
            ['name' => 'add kriteria'],
            ['name' => 'edit kriteria'],
            ['name' => 'read kriteria'],
            ['name' => 'delete kriteria'],

            ['name' => 'add dataset'],
            ['name' => 'edit dataset'],
            ['name' => 'read dataset'],
            ['name' => 'delete dataset'],

            ['name' => 'add classify'],
            ['name' => 'edit classify'],
            ['name' => 'read classify'],
            ['name' => 'delete classify'],
            ['name' => 'run classify'],
        ];

        foreach ($permission_admin as $key => $value) {
            $prms = Permission::create($value);
            $admin->givePermissionTo($prms);
        }
        $admin->givePermissionTo(['name'=> 'read label']);
        $admin->givePermissionTo(['name'=> 'edit label']);
        $admin->givePermissionTo(['name'=> 'edit jenis_tanaman']);

        $permission_user = [
            ['name' => 'read dataset'],
            ['name' => 'read classify'],
            ['name' => 'run classify'],
        ];

        foreach ($permission_user as $key => $value) {
            $user->givePermissionTo($prms);
        }

        $super_admin->givePermissionTo(Permission::all());

        $user_super_admin->assignRole($super_admin);
        $user_admin->assignRole($admin);
    }
}
