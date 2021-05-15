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

const url_users = '/admin/list';
const url_roles = '/admin/roles';
const url_save_user = '/admin/add';
const url_delete_user = '/admin/delete';
let url_user = '/user/getUser';

let admin = function () {

    return {
        getAllUsers: async function () {
            let users_json;
            let response = await fetch(url_users);
            if (response.ok) {
                users_json = await response.json();
            }
            return users_json;
        },

        getAllRoles: async function () {
            let roles_json;
            let response = await fetch(url_roles);
            if (response.ok) {
                roles_json = await response.json();
            }
            return roles_json;
        },

        getUser: async function () {
            let user_json;
            let response = await fetch(url_user);
            if (response.ok) {
                user_json = await response.json();
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
            return user_json;
        },


        saveUser: async function (user) {
            let response = await fetch(url_save_user, {
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
                    "1)Нельзя создавать пользователей с одинаковыми Email address(ми)"+'\n'+
                    "2) оставлять поле Email address не заполненным"+ '\n'+
                    "3) при изменении Email следует обязательно заполнить Password" + '\n'+
                    "Ошибка HTTP: " + response.status
                );
            }
        },

        deleteUser: async function (user) {
            let response = await fetch(url_delete_user, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                await response;
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
        }
    }};

$(function () {
    let api = admin();

    function updateUsers() {
        let tbody = $('#body_users_table');
        let tbody_user = $('#body_user_table');
        let head_text = $('#header_text');
        let roles_text;
        tbody.empty();
        tbody_user.empty();

        //заполняем вкладку User
        api.getUser().then(user_json => {
            roles_text = user_json.roles.map(r=>r.name).map(r => r.replaceAll("ROLE_", "")).join(' ');
            // console.alert('roles_text');
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

        //заполняем вкладку Admin
        api.getAllUsers().then(users_json => {
            for (let i = 0; i < users_json.length; i++) {
                let user = new User();//пользователь для передачи в модальное окно
                user.id = users_json[i].id;
                user.username = users_json[i].username;
                user.surname = users_json[i].surname;
                user.age = users_json[i].age;
                user.email = users_json[i].email;
                user.roles = users_json[i].roles;
                roles_text = users_json[i].roles.map(r => r.name).map(r => r.replaceAll("ROLE_", "")).join(' ');
                // console.log(roles_text);
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

        //добавляем все возможные роли в селект на закладке нового пользователя, в модальных окнах удаления и редактирования
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
    //собираем нового пользователя и отправляем запрос на его создание кликом по кнопке с id= "btn_new_user"
    $('#btn_new_user').click(function () {
        let new_user = new User();

        // заполняем нового пользователя данными (у всех полей ввода на вкладке с id="nav_newuser" атрибут class="form-control"
        $('#nav_newuser .form-control').each(function (index, element) {
            new_user[element.name] = element.value;
        });
        new_user.id = 0;//поскольку новый , то id=0

        //получаем массив выбранных ролей и добавляем их новому пользователю
        let userRolesSelect = $('#exampleRoleSelect');
        let selected_roles = userRolesSelect.find('option:selected').map(function () {
            let role = new Role();
            role.id = $(this).val();
            role.name = "ROLE_" + $(this).text();
            return role;
        }).toArray();
        new_user.roles = selected_roles;

        //очищаем поля input  и селектора ролей
        //отправляем нового пользователя и обновляем таблицу пользователей
        api.saveUser(new_user).then(r => {
            $('#nav_newuser').find('input[type="text"],input[type="password"],input[type="number"],input[type="email"]').val('');
            $('#exampleRoleSelect').find('option').remove();
            $('.tab-pane [href="#nav-home"]').tab('show');
            updateUsers();
        });

    });

    //заполняем данные после отрисовки модального окна редактирования пользователя
    $('#editModal').on('shown.bs.modal', function (e) {
        let user = JSON.parse(e.relatedTarget.dataset.user);
        user.password = '';
        let roles = user.roles;
        $('#editModal .form-control').each(function (index, element) {
            element.value = user[element.name];
        });
        //заполняем текущие роли пользователя
        for (let i = 0; i < roles.length; i++) {
            $('#exampleRoleSelectEdit option[value = ' + roles[i].id + ']').prop('selected', true);
        }

    })


//заполняем данные после отрисовки модального окна удаления пользователя
    $('#deleteModal').on('shown.bs.modal', function (e) {
        let user = JSON.parse(e.relatedTarget.dataset.user);
        user.password = '';
        let roles = user.roles;
        $('#deleteModal .form-control').each(function (index, element) {
            element.value = user[element.name];
        });
        //заполняем текущие роли пользователя
        for (let i = 0; i < roles.length; i++) {
            $('#exampleRoleSelectDelete option[value = ' + roles[i].id + ']').prop('selected', true);
        }
    })

    $('#button_edit_user').click(function () {
        let new_user = new User();

        // заполняем нового пользователя данными (у всех полей ввода на вкладке с id="newuser" атрибут class="form-control"
        $('#editModal .form-control').each(function (index, element) {
            new_user[element.name] = element.value;
        });
        console.log(new_user);
        //получаем массив выбранных ролей и добавляем их новому пользователю
        let userRolesSelect = $('#exampleRoleSelectEdit');
        let selected_roles = userRolesSelect.find('option:selected').map(function () {
            let role = new Role();
            role.id = $(this).val();
            role.name = "ROLE_" + $(this).text();
            return role;
        }).toArray();
        new_user.roles = selected_roles;

        //очищаем поля input  и селектора ролей
        //отправляем нового пользователя и обновляем таблицу пользователей
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

        // заполняем нового пользователя данными (у всех полей ввода на вкладке с id="newuser" атрибут class="form-control"
        $('#deleteModal .form-control').each(function (index, element) {
            new_user[element.name] = element.value;
        });
        console.log(new_user);
        //получаем массив выбранных ролей и добавляем их новому пользователю
        let userRolesSelect = $('#exampleRoleSelectDelete');
        let selected_roles = userRolesSelect.find('option:selected').map(function () {
            let role = new Role();
            role.id = $(this).val();
            role.name = "ROLE_" + $(this).text();
            return role;
        }).toArray();
        new_user.roles = selected_roles;

        //очищаем поля input  и селектора ролей
        //отправляем нового пользователя и обновляем таблицу пользователей
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
