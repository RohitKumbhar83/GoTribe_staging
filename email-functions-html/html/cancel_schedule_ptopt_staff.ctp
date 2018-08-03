<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>GoTRIBE::PT/OPT Schedules</title>
    </head>
    <body>
        <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" style="font-family:Arial, sans-serif; font-size:13px;">
            <tbody>
                <tr>
                    <td style="text-align: center;background: #000000;">
                        <table cellpadding="0" cellspacing="0" style="width:80%;text-align:center;padding: 25px 0;color: #fff;margin:auto;" align="center">
                            <tbody>
                                <tr>
                                    <td><a href="" target="_blank"><img style="display: inline-block; width: 200px;" src="<?php echo $_SERVER['HTTP_HOST']; ?>/img/Thumbnail-img2.png" alt="GoTribe"></a></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td>
                                        <p>Hi <strong><?php echo $name; ?>,</strong></p>
                                        <p>You have been successfully canceled <strong><?php echo $schedule_type; ?></strong> schedule. Please find the below info.</p>
                                        <p><strong>Licensee:</strong> <?php echo $licensee; ?></p>
                                        <p><strong>Class:</strong> <?php echo $class; ?></p>
                                        <p><strong>Member:</strong> <?php echo $customer; ?></p>
                                        <p><strong>Schedule Type:</strong> <?php echo $schedule_type; ?></p>
                                        <p>&nbsp;</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="100%" border="1" cellspacing="0" cellpadding="10">
                                            <tbody>
                                                <tr>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Day</th>
                                                    <th scope="col">Time</th>
                                                    <th scope="col">Status</th>
                                                </tr>
                                                <tr>
                                                    <td><?php echo date($this->Gym->getSettings('date_format'),strtotime($date)) ?></td>
                                                    <td><?php echo date('l',strtotime($date)); ?></td>
                                                    <td><?php echo $time; ?></td>
                                                    <td bg-color="red">Canceled</td>
                                                </tr>
                               
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                                    <tr>
                                    <td>
                                        <p>&nbsp;</p>
                                        <p><strong>P.S.</strong>We would also love to hear from you. Let us know if you have any more queries at <a href="mailto:gotribe@gotribefit.com" style="color:#ed4934; font-weight:bold;">gotribe@gotribefit.com</a>. </p>
                                        <p>&nbsp;</p>
                                        <p><strong>Thanks,</strong><br/>
                                        GoTRIBE Team.</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td width="40%" style="padding: 0px 26px 0 26px;background: #000000; color:#ffffff;"><p style="color:#ffffff;font-size: 13px; margin:0; padding:10px 0px;; font-weight:600; font-family:'Open Sans',Arial,Helvetica,sans-serif;"> Phone: (866) 944-4607 </p></td>
                                    <td width="60%" style="padding: 0px 26px 0 26px;background: #000000; color:#ffffff; text-align:right;"><p style="color:#ffffff;font-size: 13px; margin-bottom:20px; padding:10px 0px;; font-weight:600; font-family:'Open Sans',Arial,Helvetica,sans-serif;"> <strong>Website:</strong> <a href="www.gotribefit.com" style="color:#ffffff;">www.gotribefit.com</a> </p></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
</html>