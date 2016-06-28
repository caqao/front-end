function SendLogin() {
    var csrftoken = getCookie('csrftoken');
    var u = document.getElementById('username');
    var p = document.getElementById('password');

    $.ajax({
        url: "",
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrftoken,
            username: u.value,
            password: p.value,
            post_action: 'login'
        },
        success: function (json) {
            var good_login = json.valid;
            if (good_login===1){
            var redirect_url = json.next_page;
            redirect(redirect_url);
        }else{
            alert('Mauvais pseudonyme ou mot de passe')
        }
        },
        error: function () {
            console.log('didnt work')
        }


    });
}

function AskPasswordChange() {
    var csrftoken = getCookie('csrftoken');
    var e = document.getElementById('forgotten_email').value;

    $.ajax({
        url: "",
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrftoken,
            email: e,
            post_action: 'forgotten_pw'
        },
        success: function (json) {
            var successful = json.valid;
            if (successful===1){
                var address = json.address;
                alert("Un message vous a été envoyé à l'adresse "+address+" avec un mot de passe temporaire." +
                    "Votre ancien mot de passe a été désactivé")
            }else{

                alert("Adresse non reconnue, assurez-vous d'entrer celle que vous avez fournie" +
                    " à votre première connexion. En cas d'oubli, veuillez consulter un administrateur")
            }
        },
        error: function () {
            console.log('didnt work')
        }


    });
}

function NewUserRequest() {
    var csrftoken = getCookie('csrftoken');
    var fn = document.getElementById('first_name').value;
    var ln = document.getElementById('last_name').value;
    var un = document.getElementById('new_username').value;
    var em = document.getElementById('email').value;
    var p1 = document.getElementById('pass1').value;
    var p2 = document.getElementById('pass2').value;
    var gr = document.getElementById('group_pick').value;

    $.ajax({
        url: "",
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrftoken,
            first_name: fn,
            last_name: ln,
            username: un,
            email: em,
            pass1: p1,
            pass2: p2,
            group: gr,

            post_action: 'new_user'
        },
        success: function (json) {
            var successful = json.valid;
            if (successful===1){
                var redirect_url = json.next_page;
                redirect(redirect_url);
            }else{
                alert(json.error_message)
            }
        },
        error: function () {
            console.log('didnt work')
        }


    });
}
function ChangePasswordRequest() {
    var csrftoken = getCookie('csrftoken');
    var p0 = document.getElementById('oldpass').value;
    var p1 = document.getElementById('newpass1').value;
    var p2 = document.getElementById('newpass2').value;

    $.ajax({
        url: "",
        type: 'POST',
        data: {
            csrfmiddlewaretoken: csrftoken,
            oldpass: p0,
            newpass1: p1,
            newpass2: p2,

            post_action: 'change_pw'
        },
        success: function (json) {
            var successful = json.valid;
            if (successful===1){
                var redirect_url = json.next_page;
                alert(json.message)
                redirect(redirect_url);
            }else{
                alert(json.error_message)
            }
        },
        error: function () {
            console.log('didnt work')
        }


    });
}

$(function () {
    $('.GenericLoginButton').button();
});