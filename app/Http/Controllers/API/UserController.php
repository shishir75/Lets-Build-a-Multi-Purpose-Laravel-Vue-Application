<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::latest()->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required | max: 191',
            'email' => 'required | email | max:191 | unique:users',
            'password' => 'required | string | min:8',
            'type' => 'required | string',
            'bio' => 'nullable',
        ]);

        return User::create([
           'name' => $request['name'],
           'email' => $request['email'],
           'bio' => $request['bio'],
           'type' => $request['type'],
           'photo' => $request['photo'],
           'password' => Hash::make($request['password']),
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    public function profile()
    {
        return auth('api')->user();
    }

    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        $this->validate($request, [
            'name' => 'required | max: 191',
            'email' => 'required | email | max:191 | unique:users,email,'.$user->id,
            'password' => 'sometimes | required | string | min:8',
            'bio' => 'nullable',
            'photo' => 'sometimes | required'
        ]);


        $currentPhoto = $user->photo;

        if ($request->photo != $currentPhoto ) {
            $currentDate = Carbon::now()->toDateString();

            $extension = explode('/', explode(':', substr($request->photo, 0, strpos($request->photo, ';')))[1])[1];

            $imageName = $currentDate.'-'.uniqid(). '.' .$extension;

            Image::make($request->photo)->save(public_path('img/profile/'). $imageName);

            $request->merge(['photo' => $imageName]);
        }

        if (!empty($request->password)) {
            $request->merge(['password' => Hash::make($request['password'])]);
        }

        if ($user->update($request->all())) {

            return ['message', 'Updated'];
        } else {
            return ['message', 'Not Updated'];
        }

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $this->validate($request, [
            'name' => 'required | max: 191',
            'email' => 'required | email | max:191 | unique:users,email,'.$user->id,
            'password' => 'sometimes | required | string | min:8',
            'type' => 'required | string',
            'bio' => 'nullable',
        ]);

        $user->update($request->all());

        return ['message', 'User have been updated'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id)->delete();


        return ['message', 'User have been Deleted'];
    }
}
