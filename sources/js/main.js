function showMessage(inputArray, title, confirmText, icon) {
    let iconTypes = ['error', 'info', 'success', 'warning', 'question'];
    if (Array.isArray(inputArray)) {
        Swal.fire({
            icon: iconTypes[icon],
            title: title,
            confirmButtonText: confirmText,
            showCloseButton: true,
            focusConfirm: true,
            text: inputArray.join("\r\n")
        });
        let content = $("#swal2-content");
        content.css("white-space", "pre-wrap");
        content.css("text-align", "justify");
    } else {
        alert("Input is not Array");
    }
}

function showLoading(show = true) {
    if (show) {
        $("#loadingDiv").css("display", "flex");
    } else {
        $("#loadingDiv").css("display", "none");
    }
}

function isJsonString(str) {
    if (str === '' || str === null) {
        return false;
    }
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function convertToSQLFunctionsInput(input) {
    let persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"],
        englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    let justPersianNumber = /^[۰۱۲۳۴۵۶۷۸۹]{2,}$/;
    let temp = input !== null && input !== "" ? input.split("/") : [];
    if (temp.length === 3 && justPersianNumber.test(temp[0]) && justPersianNumber.test(temp[1]) && justPersianNumber.test(temp[2])) {
        for (let i = 0; i < 10; i++) {
            temp[0] = temp[0].replace(new RegExp(persianNumbers[i], "g"), englishNumbers[i]);
        }
        for (let i = 0; i < 10; i++) {
            temp[1] = temp[1].replace(new RegExp(persianNumbers[i], "g"), englishNumbers[i]);
        }
        for (let i = 0; i < 10; i++) {
            temp[2] = temp[2].replace(new RegExp(persianNumbers[i], "g"), englishNumbers[i]);
        }
        return jalali_to_gregorian(parseInt(temp[0]), parseInt(temp[1]), parseInt(temp[2]));
    } else {
        return false;
    }
}

function jalali_to_gregorian(jy, jm, jd) {
    let sal_a, gy, gm, gd, days;
    jy += 1595;
    days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy = 400 * ~~(days / 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * ~~(--days / 36524);
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
        gy += ~~((days - 1) / 365);
        days = (days - 1) % 365;
    }
    gd = days + 1;
    sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
    gy = gy.toString();
    gm = gm < 10 ? "0" + gm : gm;
    gd = gd < 10 ? "0" + gd : gd;
    return gy + "-" + gm + "-" + gd;
}

function checkPersianDateString(inputDateString) {
    let persianDatePattern = /^[۰۱۲۳۴۵۶۷۸۹]+\/[۰۱۲۳۴۵۶۷۸۹]{2}\/[۰۱۲۳۴۵۶۷۸۹]{2}$/;
    return persianDatePattern.test(inputDateString);
}

function validateInput(id, status) {
    if (status === 0) {
        id.css("border", "1px solid #B00020");
    } else if (status === 1) {
        id.css("border", "1px solid green");
    } else if (status === 2) {
        id.css("border", "1px solid #8C8C8C");
    } else {
        id.css("border", "none");
    }
}

function validateResignationForm() {
    let everyThing = /^([\r\n]|.){1,500}$/;
    let everyThingErrorMessage = "لطفا تعداد کاراکتر وارد شده بین ۱ تا ۵۰۰ کاراکتر باشد";
    let textRequiredErrorMessage = "لطفا مقداری برای این فیلد وارد نمایید";
    let dateInvalidErrorMessage = "لطفا از تقویم برای انتخاب مقدار استفاده نمایید";
    let hasAnyError = false;
    let returnData = {};

    let contentContainer = $("");

    let suggested_date = contentContainer.find('input#suggested_date');
    let validationArea = suggested_date.parent().parent().find("span.validationArea");
    if (suggested_date.val().trim() === "") {
        hasAnyError = true;
        validationArea.text(textRequiredErrorMessage);
        validateInput(suggested_date, 0);
    } else if (!checkPersianDateString(suggested_date.val())) {
        hasAnyError = true;
        validationArea.text(dateInvalidErrorMessage);
        validateInput(suggested_date, 0);
    } else if (new Date(new Date().toJSON().slice(0, 10)).getTime() >= new Date(convertToSQLFunctionsInput(suggested_date.val().trim())).getTime()) {
        hasAnyError = true;
        validationArea.text("شروع تاریخ پیشنهادی خروج از سازمان باید از روز بعد باشد!");
        validateInput(suggested_date, 0);
    } else {
        validateInput(suggested_date, 1);
        validationArea.empty();
        returnData.TERMINATION_SUGGEST_DATE = convertToSQLFunctionsInput(suggested_date.val().trim());
    }

    let REQUEST_TERMINATION_REASONS_IDS = $("input.chips:is(:checked)").map(function () {
        return parseInt($(this).val());
    }).get();
    validationArea = $("span#no-reason");
    if (REQUEST_TERMINATION_REASONS_IDS.length === 0) {
        validationArea.text("حداقل باید یک دلیل برای استعفا مشخص کنید");
    } else {
        validationArea.empty();
        returnData.REQUEST_TERMINATION_REASONS_IDS = JSON.stringify(REQUEST_TERMINATION_REASONS_IDS);
    }

    let DESCRIPTION = contentContainer.find("textarea#description");
    validationArea = DESCRIPTION.parent().find("span.validationArea");
    if (DESCRIPTION.val().trim() === "") {
        hasAnyError = true;
        validationArea.text(textRequiredErrorMessage);
        validateInput(DESCRIPTION, 0);
    } else if (!everyThing.test(DESCRIPTION.val())) {
        hasAnyError = true;
        validationArea.text(everyThingErrorMessage);
        validateInput(DESCRIPTION, 0);
    } else {
        validateInput(DESCRIPTION, 1);
        validationArea.empty();
        returnData.DESCRIPTION = DESCRIPTION.val().trim();
    }

    let APP_DOC = contentContainer.find("div.uploaded div span.file_name");
    validationArea = APP_DOC.parent().parent().parent().parent().find("span.validationArea");
    if (APP_DOC.attr("app_doc") === undefined) {
        hasAnyError = true;
        validationArea.text(fileRequiredErrorMessage);
    } else {
        validationArea.empty();
        returnData.TERMINATION_FILE = APP_DOC.attr("app_doc");
    }

    return hasAnyError ? false : returnData;
}

$.ajax({
    type: "PUT",
    url: "api/request_handler.php",
    data: {
        REQUEST: 1
    },
    beforeSend: function () {
        showLoading();
    },
    async: false,
    success: function (XMLHttpRequest, status, error) {
        XMLHttpRequest = isJsonString(XMLHttpRequest) ? JSON.parse(XMLHttpRequest) : XMLHttpRequest;
        let decider = XMLHttpRequest[0];
        let content = XMLHttpRequest[1];
        content = JSON.parse(content);
        if (decider) {
            showMessage(content, "موفق", "تأیید", 2);
        } else {
            showMessage(content, "خطا", "تأیید", 0);
        }
    },
    error: function (xhr) {
        showMessage([`statusText: ${xhr.statusText} responseText: ${xhr.responseText}`], "خطا", "تأیید", 0);
    },
    complete: function () {
        showLoading(false);
    },
});
