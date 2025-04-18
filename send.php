<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = strip_tags(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $message = strip_tags(trim($_POST['message']));
    
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['message' => 'Veuillez remplir tous les champs correctement.']);
        exit;
    }
    
    $recipient = "votre@email.com";
    $subject = "Nouveau message de $name";
    $email_content = "Nom: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";
    $email_headers = "From: $name <$email>";
    
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(['message' => 'Merci! Votre message a été envoyé.']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Oops! Une erreur est survenue, le message n\'a pas pu être envoyé.']);
    }
} else {
    http_response_code(403);
    echo json_encode(['message' => 'Il y a eu un problème avec votre envoi, veuillez réessayer.']);
}
