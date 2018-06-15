function deal() {
    var file = new FormData(document.getElementById("picForm"));
    file.append("CustomField", "This is some extra data");
    $.ajax({
        url: urlport+"comment/list",
        type: "POST",
        data: file,
        processData: false,
        contentType: false
    });
}

