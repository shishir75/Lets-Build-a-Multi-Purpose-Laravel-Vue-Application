<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Responsive Hover Table</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" data-toggle="modal" data-target="#addNew">
                                <i class="fas fa-user-plus mr-1"></i>
                                Add New
                            </button>
                        </div>

                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover text-nowrap">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email Address</th>
                                <th>Type</th>
                                <th>Registered At</th>
                                <th>Modify</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td>{{ user.id }}</td>
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.type | ucFirst }}</td>
                                <td>{{ user.created_at | myDate }}</td>
                                <td>
                                    <a href="#" class="btn btn-sm btn-outline-info">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <a href="#" class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </a>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addNewLabel"><i class="fas fa-user-plus mr-1 green"></i> Add New User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="createUser" @keydown="form.onKeydown($event)">
                        <div class="modal-body">

                            <div class="form-group">
                                <label>Name</label>
                                <input v-model="form.name" type="text" name="name"
                                       placeholder="Enter Name"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>

                            <div class="form-group">
                                <label>Email Address</label>
                                <input v-model="form.email" type="text" name="email"
                                       placeholder="Enter Email Address"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>

                            <div class="form-group">
                                <label>User Bio</label>
                                <textarea v-model="form.bio" type="text" name="bio"
                                       placeholder="Enter User Short Bio ( Optional )"
                                          class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>

                            <div class="form-group">
                                <label>User Type</label>
                                <select v-model="form.type" type="text" name="type" class="form-control" :class="{ 'is-invalid':
                                                        form.errors.has('type') }">
                                    <option value="" disabled>Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Standard User</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>

                            <div class="form-group">
                                <label>Password</label>
                                <input v-model="form.password" type="password" name="password"
                                       placeholder="Enter Password"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel <i class="fas fa-times-circle ml-1"></i></button>
                            <button type="submit" :disabled="form.busy" class="btn btn-primary">Create <i class="fas fa-plus-circle ml-1"></i></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        data() {
          return {
              users: {},
              form: new Form({
                  name: '',
                  email: '',
                  password: '',
                  type: '',
                  bio: '',
                  photo: ''
              })
          }
        },
        methods: {
            loadUsers() {
                axios.get('api/user').then( ({ data }) => (this.users = data.data));
            },
            createUser() {
                this.$Progress.start();
                this.form.post('api/user');

                // custom event
                Fire.$emit('AfterCreate');

                $('#addNew').modal('hide'); // hide modal

                Toast.fire({
                    icon: 'success',
                    title: 'User Created successfully!'
                })
                this.$Progress.finish();
            }
        },
        created() {
            this.loadUsers();
            Fire.$on('AfterCreate', () => this.loadUsers()); // good method
             // setInterval(() => this.loadUsers(), 3000);  // bad method
        }
    }
</script>
