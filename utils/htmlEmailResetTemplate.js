const htmlEmailResetTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer tu contraseña</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1 {
      font-size: 22px;
      color: #333333;
    }
    p {
      font-size: 16px;
      color: #555555;
      line-height: 1.5;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 20px;
      font-size: 16px;
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer {
      font-size: 12px;
      color: #777777;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Restablecer tu contraseña</h1>
    <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
    <p>Si no hiciste esta solicitud, puedes ignorar este mensaje.</p>
    <p>Para cambiar tu contraseña, haz clic en el botón de abajo:</p>
    <a href="{{reset_url}}" class="button">Restablecer contraseña</a>
    <p class="footer">Este enlace expirará en 15 minutos.</p>
    <p class="footer">Si tienes problemas, copia y pega el siguiente enlace en tu navegador:</p>
    <p class="footer"><a href="{{reset_url}}">{{reset_url}}</a></p>
  </div>
</body>
</html>
`;

module.exports = htmlEmailResetTemplate;
