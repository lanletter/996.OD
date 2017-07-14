function deal() {
    var file = new FormData(document.getElementById("picForm"));
    file.append("CustomField", "This is some extra data");
    $.ajax({
        url: "http://121.40.135.115:8080/fotile-api-0.0.2/comment/list",
        type: "POST",
        data: file,
        processData: false,
        contentType: false
    });
}

