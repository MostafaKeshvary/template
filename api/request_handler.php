<?php
function generateResponse(array $RESPONSE)
{
    return json_encode($RESPONSE, JSON_UNESCAPED_UNICODE);
}

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    $REQUEST = $_PUT['REQUEST'];
    $RESPONSE = array();
    $ERRORS = array();
    switch ($REQUEST) {
        case 1:
            $RESPONSE = ["OK"];
            break;
        default:
            $ERRORS[] = "The REQUEST <$REQUEST> not implemented!";
            break;
    }
    $RESPONSE = count($ERRORS) == 0 ? [true, json_encode($RESPONSE, JSON_UNESCAPED_UNICODE)] : [false, json_encode($ERRORS, JSON_UNESCAPED_UNICODE)];
    echo generateResponse($RESPONSE);
}