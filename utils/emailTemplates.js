export const playmateWelcomeTemplate = ({
    name,
    logoUrl = "https://res.cloudinary.com/dsw5tkkyr/image/upload/v1764918615/1758647674156_nl5ayo.png",
    primary = "#22A06B",
    accent = "#1F8A58",
    muted = "#6b7280",
    profileUrl = "https://playmate.app/me",
}) => {
    const year = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Welcome to Playmate</title>
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <style>
    table {border-collapse: collapse;}
    .spacer {font-size: 0; line-height: 0;}
    td.header-left, td.header-right {display: inline-block;}
  </style>
  <![endif]-->
  <style>
    /* Reset styles for email clients */
    * {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    /* Mobile styles */
    @media only screen and (max-width: 620px) {
      table[class="container"] {
        width: 100% !important;
        max-width: 100% !important;
      }
      td[class="header"] {
        padding: 15px !important;
      }
      td[class="body"] {
        padding: 15px !important;
      }
      td[class="header-logo"] {
        width: 80px !important;
        height: 80px !important;
        padding-right: 10px !important;
      }
      td[class="header-text"] {
        padding-left: 10px !important;
        text-align: right !important;
      }
      img[class="logo"] {
        width: 80px !important;
        height: 80px !important;
      }
      h1 {
        font-size: 20px !important;
        line-height: 1.3 !important;
      }
      p {
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
      a[class="button"] {
        padding: 14px 20px !important;
        font-size: 16px !important;
        display: block !important;
        text-align: center !important;
      }
      div[class="info-box"] {
        padding: 12px !important;
      }
      
      /* Stack header on very small screens */
      @media only screen and (max-width: 400px) {
        table[class="header-table"] tr {
          display: block !important;
          text-align: center !important;
        }
        td[class="header-logo"] {
          display: block !important;
          margin: 0 auto 10px auto !important;
          padding-right: 0 !important;
          text-align: center !important;
        }
        td[class="header-text"] {
          display: block !important;
          padding-left: 0 !important;
          text-align: center !important;
        }
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      body {
        background: #0f172a !important;
      }
      table[class="main-table"] {
        background: #1e293b !important;
      }
      td[class="body"] {
        color: #f1f5f9 !important;
      }
      p, li {
        color: #cbd5e1 !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f6f8fa; font-family: Arial, Helvetica, sans-serif; color:#0f172a; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;" bgcolor="#f6f8fa">

  <!--[if mso]>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding: 20px 10px;">
  <![endif]-->

  <center>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#f6f8fa">
      <tr>
        <td align="center" style="padding: 20px 10px;">
          
          <!-- MAIN CONTAINER -->
          <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="#ffffff" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" class="main-table">
            
            <!-- HEADER -->
            <tr>
              <td class="header" align="center" bgcolor="#22A06B" style="background: #22A06B; padding: 20px; color: #ffffff;">
                <table class="header-table" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                  <tr>
                    <!-- LEFT: LOGO -->
                    <td class="header-logo" align="left" valign="middle" style="width: 100px; padding-right: 20px; vertical-align: middle;">
                      <!--[if mso]>
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:100px; width:100px; v-text-anchor:middle;" arcsize="50%" strokecolor="#22A06B" fillcolor="#22A06B">
                        <w:anchorlock/>
                        <center style="color:#ffffff;">
                      <![endif]-->
                      <img src="${logoUrl}" class="logo" width="100" height="100" alt="Playmate Logo" style="border-radius: 50%; border: 0; outline: none; display: block; max-width: 100%; height: auto;">
                      <!--[if mso]>
                        </center>
                      </v:roundrect>
                      <![endif]-->
                    </td>
                    
                    <!-- RIGHT: TEXT -->
                    <td class="header-text" align="right" valign="middle" style="vertical-align: middle; text-align: right;">
                      <h2 style="margin: 0; color: #ffffff !important; font-size: 20px; font-weight: bold; text-align: right;">Playmate</h2>
                      <p style="margin: 0; margin-top: 4px; font-size: 14px; color: #ffffff !important; text-align: right;">Book • Play • Share</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- SPACER -->
            <tr><td class="spacer" height="0" style="font-size: 0; line-height: 0;">&nbsp;</td></tr>
            
            <!-- BODY -->
            <tr>
              <td class="body" style="padding: 20px; color: #0f172a;">
                
                <h1 style="font-size: 22px; margin: 0 0 10px 0; color: #0f172a; font-weight: bold;">Welcome to Playmate, ${name} 👋</h1>
                
                <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; color: #444444;">
                  You're all set! Playmate helps sports lovers book nearby venues, join matches, and share moments on a fun social feed.
                </p>
                
                <!-- INFO BOX -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                  <tr>
                    <td class="info-box" bgcolor="#f0fff6" style="background: #f0fff6; border: 1px solid #b9efd6; padding: 15px; border-radius: 8px;">
                      <p style="margin: 0 0 8px 0; font-weight: 600; color: #0f172a;">Get started on Playmate:</p>
                      <ul style="margin: 0; padding-left: 18px; color: #444;">
                        <li style="margin-bottom: 5px;">Discover & book nearby sports venues</li>
                        <li style="margin-bottom: 5px;">Join games or host your own</li>
                        <li style="margin-bottom: 0;">Follow players & share sports highlights</li>
                      </ul>
                    </td>
                  </tr>
                </table>
                
                <!-- SPACER -->
                <tr><td class="spacer" height="25" style="font-size: 0; line-height: 0;">&nbsp;</td></tr>
                
                <!-- BUTTON -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                  <tr>
                    <td align="center">
                      <!--[if mso]>
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://playmate.app/me" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="10%" strokecolor="#22A06B" fillcolor="#22A06B">
                        <w:anchorlock/>
                        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:600;">
                          Complete Your Profile
                        </center>
                      </v:roundrect>
                      <![endif]-->
                      <a href="https://playmate.app/me" class="button" style="display: inline-block; padding: 12px 22px; background: #22A06B; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 6px; line-height: 1.5; -webkit-text-size-adjust: none; mso-hide: all;">
                        Complete Your Profile
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- SPACER -->
                <tr><td class="spacer" height="25" style="font-size: 0; line-height: 0;">&nbsp;</td></tr>
                
                
              </td>
            </tr>
            
            <!-- FOOTER -->
            <tr>
              <td bgcolor="#f2f5f4" style="background: #f2f5f4; padding: 15px; text-align: center; color: #555555; font-size: 12px; line-height: 1.5;">
                <div style="margin-bottom: 6px;">Playmate — Book venues • Join games • Share moments</div>
                <div style="margin-bottom: 6px;">If you didn't sign up, please ignore this email.</div>
                <div>© ${year} Playmate</div>
              </td>
            </tr>
            
          </table>
          
        </td>
      </tr>
    </table>
  </center>

  <!--[if mso]>
      </td>
    </tr>
  </table>
  <![endif]-->

</body>
</html>
`;
};
