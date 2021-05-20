class Role {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class User {
    constructor(id, username, surname, age, email, password, roles) {
        this.id = id;
        this.username = username;
        this.surname = surname;
        this.age = age;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }
}

let admin = function () {

    return {
        getAllUsers: async function () {
            let users_json;
            let response = await fetch('/admin/list');
            if (response.ok) {
                users_json = await response.json();
            }
            return users_json;
        },

        getAllRoles: async function () {
            let roles_json;
            let response = await fetch('/admin/roles');
            if (response.ok) {
                roles_json = await response.json();
            }
            return roles_json;
        },

        getUser: async function () {
            let user_json;
            let response = await fetch('/user/getUser');
            if (response.ok) {
                user_json = await response.json();
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
            return user_json;
        },


        saveUser: async function (user) {
            let response = await fetch('/admin/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                await response;
            } else {
                alert(
                    "Attention! It is impossible:\n" +
                    "1) Add users with the same Email" + '\n' +
                    "2) Leave the Email field blank" + '\n' +
                    "3) When editing Email, be sure to fill in Password" + '\n' +
                    "Error HTTP: " + response.status);
            }

        },

        deleteUser: async function (user) {
            let response = await fetch('/admin/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                await response;
            } else {
                alert("Error HTTP: " + response.status);
            }
        }
    }
};

$(function () {
    let api = admin();

    function updateUsers() {
        let tbody = $('#body_users_table');
        let tbody_user = $('#body_user_table');
        let head_text = $('#header_text');
        let roles_text;
        tbody.empty();
        tbody_user.empty();

//fill in the tab User
        api.getUser().then(user_json => {
            roles_text = user_json.roles.map(r => r.name).map(r => r.replaceAll("ROLE_", "")).join(' ');
            let tr = $('<tr/>')
                .append($('<td/>').text(user_json.id))
                .append($('<td/>').text(user_json.username))
                .append($('<td/>').text(user_json.surname))
                .append($('<td/>').text(user_json.age))
                .append($('<td/>').text(user_json.email))
                .append($('<td/>').append($('<span/>').text(roles_text)))
            tbody_user.append(tr);
            head_text.text(user_json.email + " with roles: " + roles_text);
        });

//fill in the tab Admin
        api.getAllUsers().then(users_json => {
            for (let i = 0; i < users_json.length; i++) {
                let user = new User();//create user -> modal window
                user.id = users_json[i].id;
                user.username = users_json[i].username;
                user.surname = users_json[i].surname;
                user.age = users_json[i].age;
                user.email = users_json[i].email;
                user.roles = users_json[i].roles;
                roles_text = users_json[i].roles.map(r => r.name).map(r => r.replaceAll("ROLE_", "")).join(' ');
                let tr = $('<tr/>')
                    .append($('<td/>').text(users_json[i].id))
                    .append($('<td/>').text(users_json[i].username))
                    .append($('<td/>').text(users_json[i].surname))
                    .append($('<td/>').text(users_json[i].age))
                    .append($('<td/>').text(users_json[i].email))
                    .append($('<td/>').append($('<span/>').text(roles_text)))
                    .append($('<td/>')
                        .append('<button type="button" class="btn btn-info btn-sm ml-4 mr-2" data-user = ' + JSON.stringify(user) + ' data-toggle="modal" data-target="#editModal">Edit</button>'))
                    .append($('<td/>')
                        .append('<button type="button" class="btn btn-danger btn-sm"  data-user = ' + JSON.stringify(user) + '  data-toggle="modal" data-target="#deleteModal">Delete</button>')
                    );
                tbody.append(tr);
            }
        });

//add all possible roles to the selection on the new user tab, in the delete and edit modal windows
        api.getAllRoles().then(roles_json => {

            $('#exampleRoleSelect').find('option').remove();
            $('#exampleRoleSelectDelete').find('option').remove();
            $('#exampleRoleSelectEdit').find('option').remove();

            let roles = $('#exampleRoleSelect');
            $.each(roles_json, function (key, value) {
                roles.append('<option value="' + value.id + '">' + value.name.replaceAll("ROLE_", "") + '</option>');
            });
            roles = $('#exampleRoleSelectDelete');
            $.each(roles_json, function (key, value) {
                roles.append('<option value="' + value.id + '">' + value.name.replaceAll("ROLE_", "") + '</option>');
            });
            roles = $('#exampleRoleSelectEdit');
            $.each(roles_json, function (key, value) {
                roles.append('<option value="' + value.id + '">' + value.name.replaceAll("ROLE_", "") + '</option>');
            });
        })
    }

//create a new user and send a request to create it by clicking on the button with id="btn_new_user"
    $('#btn_new_user').click(function () {
        let new_user = new User();

// fill the new user with data, all fields id="nav_newuser" attribute class="form-control"
        $('#nav_newuser .form-control').each(function (index, element) {
            new_user[element.name] = element.value;
        });
        new_user.id = 0;

//get an array of selected roles and add them to the new user

        let userRolesSelect = $('#exampleRoleSelect');
        let selected_roles = userRolesSelect.find('option:selected').map(function () {
            let role = new Role();
            role.id = $(this).val();
            role.name = "ROLE_" + $(this).text();
            return role;
        }).toArray();
        new_user.roles = selected_roles;

//clear the input and role selector fields next send a new user and update the user table

        api.saveUser(new_user).then(r => {
            $('#nav_newuser').find('input[type="text"],input[type="password"],input[type="number"],input[type="email"]').val('');
            $('#exampleRoleSelect').find('option').remove();
            $('.tab-pane [href="#nav-home"]').tab('show');
            updateUsers();
        });

    });

//fill in the data after rendering the modal user edit window

    $('#editModal').on('shown.bs.modal', function (e) {
        let user = JSON.parse(e.relatedTarget.dataset.user);
        user.password = '';
        let roles = user.roles;
        $('#editModal .form-control').each(function (index, element) {
            element.value = user[element.name];
        });
// fill in the current user roles
        for (let i = 0; i < roles.length; i++) {
            $('#exampleRoleSelectEdit option[value = ' + roles[i].id + ']').prop('selected', true);
        }

    })


//fill in the data after rendering the modal window for deleting

    $('#deleteModal').on('shown.bs.modal', function (e) {
        let user = JSON.parse(e.relatedTarget.dataset.user);
        user.password = '';
        let roles = user.roles;
        $('#deleteModal .form-control').each(function (index, element) {
            element.value = user[element.name];
        });
// fill in the current user roles
        for (let i = 0; i < roles.length; i++) {
            $('#exampleRoleSelectDelete option[value = ' + roles[i].id + ']').prop('selected', true);
        }
    })

    $('#button_edit_user').click(function () {
        let new_user = new User();

// fill the new user with data, all fields id="nav_newuser" attribute class="form-control"
        $('#editModal .form-control').each(function (index, element) {
            new_user[element.name] = element.value;
        });
        console.log(new_user);
//get an array of selected roles and add them to the new user
        let userRolesSelect = $('#exampleRoleSelectEdit');
        let selected_roles = userRolesSelect.find('option:selected').map(function () {
            let role = new Role();
            role.id = $(this).val();
            role.name = "ROLE_" + $(this).text();
            return role;
        }).toArray();
        new_user.roles = selected_roles;

//clear the input fields and the role selector next send a new user and update the user table
        api.saveUser(new_user).then(r => {
            $('#editModal').find('input').val('');
            $('#exampleRoleSelectEdit').find('option').remove();
            $("#editModal").modal('hide');
            $('.nav-tabs a[href="#users"]').tab('show');
            updateUsers();

        });
    });

    $('#btn_delete_user').click(function () {
        let new_user = new User();

// fill the new user with data, all fields id="nav_newuser" attribute class="form-control"
        $('#deleteModal .form-control').each(function (index, element) {
            new_user[element.name] = element.value;
        });
        console.log(new_user);
//get an array of selected roles and add them to the new user
        let userRolesSelect = $('#exampleRoleSelectDelete');
        let selected_roles = userRolesSelect.find('option:selected').map(function () {
            let role = new Role();
            role.id = $(this).val();
            role.name = "ROLE_" + $(this).text();
            return role;
        }).toArray();
        new_user.roles = selected_roles;

//clear the input fields and the role selector next send a new user and update the user table

        api.deleteUser(new_user).then(r => {
            $('#deleteModal').find('input').val('');
            $('#exampleRoleSelectDelete').find('option').remove();
            $("#deleteModal").modal('hide');
            updateUsers();
            $('.nav-tabs a[href="#users"]').tab('show');
        });
    });

    updateUsers();
});


// check reloading page
window.onunload = unloadPage;

function unloadPage() {
    console.log("АХТУНГ ! ПЕРЕЗАГРУЗКА СТРАНИЦЫ!!!!").wait = 5;
}