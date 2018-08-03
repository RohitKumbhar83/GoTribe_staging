<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>GoTRIBE::Registration</title>
</head>
<body>
<table cellpadding="0" cellspacing="0" bordeer="0" align="center" width="100%" height="100%" style="color:#696969; font-family:Arial, sans-serif; line-height:25px;">
  <tbody>
    <tr>
      <td align="center"><table width="600" style=" margin:0 auto;" cellpadding="0" cellspacing="0" border="0" align="center">
          <tbody>
            <tr>
              <td style="width: 100%;text-align: center;background: #000000;"><table cellpadding="0" cellspacing="0" style="width:80%;text-align:center;padding: 25px 0;color: #fff;margin:auto;" align="center">
                  <tbody>
                    <tr>
                      <td><a href="" target="_blank"><img style="display: inline-block; width: 200px;" src="<?php echo $_SERVER['HTTP_HOST']; ?>/img/Thumbnail-img2.png" alt="GoTRIBE"></a></td>
                    </tr>
                  </tbody>
                </table></td>
            </tr>
            <tr>
              <td><table  width="600" cellpadding="0" cellspacing="0" align="left">
                  <tbody>
                    <tr>
                      <td style="background:#fff; text-align:left;"><p>Hi <strong><?php echo $name;?>,</strong></p>
                        <p><strong style="color:#ed4934;">Congratulation!</strong> Your payment of <strong>$<?php echo $amount;?></strong> has been successfully made with <strong>GoTRIBE</strong>. Please find your payment info below.</p>
                        <p><strong>Membership:</strong> <?php echo $membership;?></p>
                        <p><strong>Amount:</strong> <?php echo $amount;?></p>
                        <p><strong>Payment Method:</strong> <?php echo $method;?></p>
                        <p><strong>Transaction Id:</strong> <?php echo (isset($transaction_id) && $transaction_id !='') ? $transaction_id : '-';?></p>
                        <p><strong>Payment Made By:</strong> <?php echo $payment_made_by;?></p>
                        <p>&nbsp;</p>
                        <p><strong>P.S.</strong>We would also love to hear from you. Let us know if you have any more queries at <a href="mailto:gotribe@gotribefit.com" style="color:#ed4934; font-weight:bold;">gotribe@gotribefit.com</a>. </p>
                        <p>&nbsp;</p>
                        <p><strong>Thanks,</strong><br/>
                          GoTRIBE Team.</p></td>
                    </tr>
                  </tbody>
                </table></td>
            </tr>
            <tr>
              <td><table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td width="40%" style="padding: 21px 26px 0 26px;background: #000000; color:#ffffff;"><p style="color:#ffffff;font-size: 13px; margin:0; padding:10px 0px;; font-weight:600; font-family:'Open Sans',Arial,Helvetica,sans-serif;"> Phone: (866) 944-4607 </p></td>
                      <td width="60%" style="padding: 21px 26px 0 26px;background: #000000; color:#ffffff; text-align:right;"><p style="color:#ffffff;font-size: 13px; margin:0; padding:10px 0px;; font-weight:600; font-family:'Open Sans',Arial,Helvetica,sans-serif;"> <strong>Website:</strong> <a href="www.gotribefit.com" style="color:#ffffff;">www.gotribefit.com</a> </p></td>
                    </tr>
                  </tbody>
                </table></td>
            </tr>
          </tbody>
        </table></td>
    </tr>
  </tbody>
</table>
</body>
</html>
