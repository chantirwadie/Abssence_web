$(window).on("load",function(){
    $('.display').DataTable();
    document.getElementById("newpassword").onchange = function() {enableButton()};
    document.getElementById("newpassword_confirmation").onchange = function() {enableButton()};

    function enableButton() {
        var newPass = document.getElementById("newpassword").value ;
        var confirmationPass = document.getElementById("newpassword_confirmation").value ;
        if (newPass!="" && confirmationPass!="" && newPass == confirmationPass){
            document.getElementById("submitpassword").disabled = false;
        }
        else {
            document.getElementById("submitpassword").disabled = true;
        }
    }
});

jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });
});
