fetch("/admin/list").then(
    res => {
        res.json().then(
            person => {
                console.log(person);
                if (person.length > 0) {
                    var temp = "";

                    // start for loop
                    person.forEach((u) => {
                        temp += "<tr>"
                        temp += "<td>" + u.id + "</td>";
                        temp += "<td>" + u.username + "</td>";
                        temp += "<td>" + u.surname + "</td>";
                        temp += "<td>" + u.age + "</td>";
                        temp += "<td>" + u.email + "</td>";
                        temp += "<td>" + u.password + "</td>";
                        temp += "<td>" + u.roles.map(r=>r.name).map(r=>r.replaceAll('ROLE_', "")).join(' ') + "</td></tr>";
                    })
                    // close for loop

                    document.getElementById("userTable").innerHTML = temp;
                }
            }
        )
    }
)