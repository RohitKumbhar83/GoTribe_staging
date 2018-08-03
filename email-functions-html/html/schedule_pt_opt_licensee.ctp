<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>GoTribe::PT/OPT Schedules</title>
    </head>
    <body style="background: #fff;margin:0px;padding:0px;font-family:'Open Sans',Arial,Helvetica,sans-serif;">
        <table cellpadding="0" cellspacing="0" bordeer="0" align="center" width="100%" height="100%">
            <tbody>
                <tr>
                    <td align="center" style="text-align:center; ">
                        <table width="600" style=" margin: 0 auto; display: block !important;" cellpadding="0" cellspacing="0" border="0" align="center"> 

                            <tbody>
                                <tr>
                                    <td style="width: 100%;text-align: center;background: #E9E9E9;border-top: 6px solid #1e4491;">
                                        <table cellpadding="0" cellspacing="0" style="width:80%;text-align:center;padding: 25px 0;color: #fff;margin:auto;" align="center">
                                            <tbody><tr>
                                                    <td>
                                                        <a href="" target="_blank"><img style="display: inline-block; width: 200px;" src="<?php echo $_SERVER['HTTP_HOST']; ?>/img/Thumbnail-img2.png" alt="GoTribe"></a>
                                                    </td>
                                                </tr>
                                            </tbody></table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table cellpadding="0" cellspacing="0" align="left">
                                            <tbody>
                                                <tr style="background:#fff; text-align:left;">
                                                    <p>Hi <strong><?php echo $name; ?>,</strong></p>
                                                    <p><strong>Congratulation!</strong> Your trainer (<?php echo $staff; ?>) have been successfully scheduled <?php echo $schedule_type; ?> for a <?php echo $customer; ?>. Please have a look at following schedules.</p>
                                                    <p><strong>Trainer:</strong> <?php echo $staff; ?></p>
                                                    <p><strong>Class:</strong> <?php echo $class; ?></p>
                                                    <p><strong>Member:</strong> <?php echo $customer; ?></p>
                                                </tr>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Day</th>
                                                    <th>Time</th>
                                                </tr>
                                                <?php 
                                                foreach($dates as $date){
                                                    ?>
                                                    <tr>
                                                        <td><?php echo date($this->Gym->getSettings('date_format'),strtotime($date)) ?></td>
                                                        <td><?php echo date('l',strtotime($date)); ?></td>
                                                        <td><?php echo $time; ?></td>
                                                    </tr>
                                               <?php 
                                                }
                                                ?>
                                                <tr>
                                                    <p><strong>P.S.</strong> We also love to hearing from you and helping you with any issues you have. Please reply to this mail if you want to ask question. </p>
                                                    <p>&nbsp;</p>
                                                    <p>&nbsp;</p>
                                                    <p><strong>Thanks,</strong><br/>Gotribe Team.</p>
                                                </tr>

                                                <tr style=" text-align:center;">
                                                    <td style="padding: 21px 26px 0 26px;border-bottom: 8px solid #E9E9E9;background: #E9E9E9;">
                                                        <p style="color:#444;font-size: 13px; margin:0; padding:10px 50px;; font-weight:600; font-family:'Open Sans',Arial,Helvetica,sans-serif;">
                                                            &COPY;2015 GoTribe ALL RIGHTS RESERVED
                                                            Address : 4444 LANKERSHIM BLVD #108 LOS ANGELES CA 91602 <br/>
                                                            Phone no : +1 999-999-9999<br>
                                                            Email id : <a href="support@gotribefit.com" target="_blank" style="color: #444;">support@gotribefit.com</a>
                                                        </p> 

                                                    </td>

                                                </tr>

                                                <tr>
                                                    <td colspan="2" align="center" style="vertical-align: middle;text-align: center;padding: 10px 0px;background: #E9E9E9;border-bottom: 6px solid #1e4491;">
                                                        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto">
                                                            <tbody>

                                                                <tr>
                                                                    <td>
                                                                        <a target="_blank" href="#" style="width: 30px; text-decoration:none; padding: 0px 5px;">
                                                                            <img alt="Facebook" src="<?php echo $_SERVER['HTTP_HOST']; ?>/webroot/img/email/footer_facebook.png" style="margin:5px 0">
                                                                        </a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="#" style="width: 30px; text-decoration:none; padding: 0px 5px;">
                                                                            <img alt="LinkedIn" src="<?php echo $_SERVER['HTTP_HOST']; ?>/webroot/img/email/footer_linkedin.png" style="margin:5px 0;">
                                                                        </a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="#" style="width: 30px; text-decoration:none; padding: 0px 5px;">
                                                                            <img alt="Twitter" src="<?php echo $_SERVER['HTTP_HOST']; ?>/webroot/img/email/footer_twitter.png" style="margin:5px 0;">
                                                                        </a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="#" style="width: 30px; text-decoration:none; padding: 0px 5px;">
                                                                            <img alt="google+" src="<?php echo $_SERVER['HTTP_HOST']; ?>/webroot/img/email/google.png" style="margin:5px 0">
                                                                        </a>    
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="#" style="width: 30px; text-decoration:none; padding: 0px 5px;">
                                                                            <img alt="pinterest" src="<?php echo $_SERVER['HTTP_HOST']; ?>/webroot/img/email/pinterest.png" style="margin:5px 0">
                                                                        </a>
                                                                    </td> 
                                                                </tr>
                                                            </tbody>
                                                        </table>


                                                    </td>
                                                </tr>


                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>

</body>
</html>
