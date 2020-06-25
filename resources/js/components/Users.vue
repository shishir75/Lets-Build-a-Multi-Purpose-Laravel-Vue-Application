<template>
    <div class="container-fluid">
        <div class="row" v-if="$gate.isAdmin()">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" @click="newModal">
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
                                    <button @click="editModal(user)" class="btn btn-sm btn-outline-info">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button @click="deleteUser(user.id)" class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
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

        <div v-if="!$gate.isAdmin()">
            <not-found></not-found>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addNewLabel"><i class="mr-1"  :class=" editMode ? 'fas fa-check-square blue' : 'fas fa-plus-circle green' "></i>{{ editMode ? 'Update' : 'Add New'}}
                            User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editMode ? updateUser() : createUser()" @keydown="form.onKeydown($event)">
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
                            <button type="submit" :disabled="form.busy" :class="editMode ? 'btn btn-primary' : 'btn btn-success'">{{ editMode ? 'Update' : 'Create'}}
                                <i class="ml-1" :class=" editMode ? 'fa fa-check' : 'fas fa-plus-circle' "></i>
                            </button>
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
                  id: '',
                  name: '',
                  email: '',
                  password: '',
                  type: '',
                  bio: '',
                  photo: ''
              }),
              editMode: true,
          }
        },
        methods: {
            loadUsers() {
                if (this.$gate.isAdmin()) {
                    axios.get('api/user').then( ({ data }) => (this.users = data.data));
                }
            },
            createUser() {
                this.$Progress.start();
                this.form.post('api/user').then( () => {

                    Fire.$emit('AfterCreate'); // custom event

                    $('#addNew').modal('hide'); // hide modal

                    Toast.fire({
                        icon: 'success',
                        title: 'User Created successfully!'
                    })
                    this.$Progress.finish();

                }).catch( () => {
                    this.$Progress.fail();
                });

            },
            deleteUser(id) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {

                    if (result.value) {

                        this.$Progress.start();
                        // Send an ajax request to the server
                        this.form.delete('api/user/' +id).then( () => {

                            Fire.$emit('AfterCreate'); // custom event

                            Swal.fire(
                                'Deleted!',
                                'User have been deleted.',
                                'success'
                            )
                            this.$Progress.finish();
                        }).catch( () => {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Something went wrong!',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            this.$Progress.fail();
                        });
                    } else {
                        Toast.fire({
                            icon: 'success',
                            title: 'User remains Safe!'
                        })
                    }
                });
            },
            updateUser() {
                this.$Progress.start();

                this.form.put('api/user/' + this.form.id).then( () => {

                    $('#addNew').modal('hide'); // hide modal

                    Fire.$emit('AfterCreate'); // custom event

                    Toast.fire({
                        icon: 'success',
                        title: 'User Updated Successfully!'
                    })
                    this.$Progress.finish();

                }).catch( () => {
                    Toast.fire({
                        icon: 'error',
                        title: 'User have not been Updated!'
                    })
                    this.$Progress.fail();
                });
            },
            newModal() {
                this.form.reset();
                this.form.clear();
                this.editMode = false;
                $('#addNew').modal('show'); // show modal
            },
            editModal(user) {
                this.form.reset();
                this.form.clear();
                this.editMode = true;
                $('#addNew').modal('show'); // show modal
                this.form.fill(user);
            },
        },
        created() {
            this.loadUsers();
            Fire.$on('AfterCreate', () => this.loadUsers()); // good method
             // setInterval(() => this.loadUsers(), 3000);  // bad method
        }
    }
</script>
