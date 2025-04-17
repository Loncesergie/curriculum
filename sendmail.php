<?php
header('Content-Type: application/json');

// Configuration
$to = 'sergie.king5@gmail.com';
$subjectPrefix = 'Portfolio Contact: ';

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the form fields and remove whitespace
    $name = strip_tags(trim($_POST['name']));
    $name = str_replace(array("\r","\n"),array(" "," "),$name);
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($_POST['subject']));
    $message = trim($_POST['message']);

    // Check that data was sent to the mailer
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs du formulaire correctement.']);
        exit;
    }

    // Set the recipient email address
    $subject = $subjectPrefix . $subject;

    // Build the email content
    $email_content = "Nom: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Build the email headers
    $email_headers = "From: $name <$email>";

    // Send the email
    if (mail($to, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Merci! Votre message a été envoyé avec succès.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Oops! Une erreur s\'est produite et nous n\'avons pas pu envoyer votre message.']);
    }
} else {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Il y a eu un problème avec votre soumission, veuillez réessayer.']);
}
?>