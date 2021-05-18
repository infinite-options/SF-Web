import React, {useContext} from 'react';
import {Dialog, Typography, Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import StoreNavBar from '../../StoreNavBar';
import StoreContext from '../../storeContext';
import appColors from '../../../styles/AppColors';
import Background from '../../../icon/Rectangle.svg';

const useStyles = makeStyles((theme) => ({
    termsAndCondsContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(8),
        background: `transparent url(${Background}) 0% 0% no-repeat padding-box`,
    },

    pageLabel: {
        textDecoration: 'underline',
        fontSize: '24px',
        fontWeight: 'bold',
        color: appColors.secondary,
    },

    tacOpener: {
        marginTop: theme.spacing(2),
        fontSize: '17px',
    },

    sectionTitle: {
        fontWeight: 'bold',
        marginTop: theme.spacing(3),
    },

    sectionContent: {
        fontSize: '17px',
    },
}));

export default function TermsAndConditions(props) {
    const classes = useStyles();
    const storeContext = useContext(StoreContext);

    return (
        <Dialog fullScreen open = {props.opened}>
            <StoreNavBar storePage = {storeContext.storePage} setStorePage = {storeContext.setStorePage}/>

            <Box className = {classes.termsAndCondsContainer}>
                <Typography className = {classes.pageLabel}>
                    Terms And Conditions
                </Typography>
                <Typography className = {classes.tacOpener}>
                    Updated: May 2021
                </Typography>
                <Typography className = {classes.tacOpener}>
                    PLEASE REVIEW THE TERMS OF THIS AGREEMENT CAREFULLY. IF YOU DO NOT AGREE TO THIS AGREEMENT IN ITS ENTIRETY, YOU ARE NOT AUTHORIZED TO USE THE SERVING FRESH OFFERINGS IN ANY MANNER OR FORM.
                </Typography>
                <Typography className = {classes.tacOpener}>
                    THIS AGREEMENT REQUIRES THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR CLASS ACTIONS, AND ALSO LIMITS THE REMEDIES AVAILABLE TO YOU IN THE EVENT OF A DISPUTE.
                </Typography>
                <Typography className = {classes.tacOpener}>
                    Welcome to Serving Fresh. These terms and conditions (this “Agreement”) govern when you: (a) access or use the Serving Fresh website or any other online Serving Fresh platform (collectively, the “Site”); (b) access or use the Serving Fresh mobile application (the “App”); (c) access and/or view any of the video, audio, stories, text, photographs, graphics, artwork and/or other content featured on the Site and/or in the App (collectively, “Content”); (d) sign up to receive the Serving Fresh subscription food-delivery service, and/or any other products or services offered by Serving Fresh from time to time; (e) access links to Serving Fresh’s social media pages/accounts on third-party social media websites or mobile or other platforms, such as Facebook®, Instagram®, Pinterest®, LinkedIn®, Twitter®, Snapchat®, and YouTube® (collectively, “Social Media Pages”); (f) enter one of the sweepstakes, contests and/or other promotions offered or conducted by Serving Fresh from time-to-time (collectively, “Promotions”); and/or (g) utilize the many interactive features of the Site and/or App designed to facilitate interaction between you, Serving Fresh and other users of the Site and App, respectively, including, but not limited to, blogs and associated comment sections located in designated areas of the Site and App, as applicable (collectively, the “Interactive Services” and together with the Site, App, Content, Social Media Pages and Promotions, the “Serving Fresh Offerings”). By using the Serving Fresh Offerings, you acknowledge that you have read, understood, and agree to be legally bound by this Agreement and have read and understand our Privacy Policy. Further, you agree to enter into a legal binding agreement with Serving Fresh. Please do not access or use the Serving Fresh Offerings if you are unwilling or unable to be bound by this Agreement. The Serving Fresh Offerings are based and operated in the United States. We make no claims concerning whether the content may be downloaded, viewed, or be appropriate for use outside of the United States. If you access the Service or the Content from outside of the United States, you do so on your own initiative and at your own risk. Whether inside or outside of the United States, you are solely responsible for ensuring compliance with the laws of your specific jurisdiction.
                </Typography>
                <Typography className = {classes.tacOpener}>
                    We may modify this Agreement from time to time at our sole discretion. When changes are made, we will notify you by making the revised version available on this webpage, and will indicate at the top of this page the date that revisions were last made. You should revisit this Agreement on a regular basis as revised versions will be binding on you. Any such modification will be effective upon our posting of new terms and conditions. You are responsible for staying informed of any changes and are expected to check this page from time to time so you are aware of any changes. You understand and agree that your continued access to or use of the Serving Fresh Offerings after any posted modification to this Agreement indicates your acceptance of the modifications. If you do not agree with the modified terms and conditions, you should stop using the Serving Fresh Offerings.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Eligibility
                </Typography>
                <Typography className = {classes.sectionContent}>
                    By using the Serving Fresh Offerings, you represent that you are at least eighteen (18) years of age (or the applicable age of majority if greater than eighteen (18) years of age in your jurisdiction), and have the requisite power and authority to enter into the Agreement and perform your obligations hereunder.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Registration
                </Typography>
                <Typography className = {classes.sectionContent}>
                    During the registration process, you will be asked to create an account and establish a password. Your account is for your personal, non-commercial use only. In creating it, we ask that you provide complete and accurate information. Please read our Privacy Policy on how this information will be used. You are responsible for maintaining the confidentiality of your account password and you are responsible for all activities that occur in connection with your account made by you or anyone you allow to use your account. You agree to safeguard your account password from access by others. You agree to indemnify and hold harmless Serving Fresh for losses incurred by Serving Fresh or another party due to someone else using your account or password. Serving Fresh has the right to disable any user name, password or other identifier, whether chosen by you or provided by Serving Fresh, at any time, in its sole discretion for any or no reason, if, in our opinion, you have violated any provisions of this Agreement.
                    Serving Fresh reserves the right to withdraw or amend the Serving Fresh Offerings, and any service or material we provide on the Site, the App or Social Media Pages, in its sole discretion without notice. Serving Fresh will not be liable if for any reason all or any part of the Site is unavailable at any time or for any period. From time to time, Serving Fresh may restrict access to some parts of the Serving Fresh Service, or the entire Serving Fresh Service, to users, including registered users.
                    Nutrition Information
                    Please note that nutritional information on our site reflects recent updates to meals based on evolving ingredients. Serving Fresh does not guarantee the accuracy of any nutritional information provided by Serving Fresh. Serving Fresh will not be responsible for any loss or damage resulting from your reliance on nutritional information, nor for ensuring that whatever foods you purchase or consume are in accordance with your respective dietary needs, restrictions or preferences. You should always check the ingredients associated with any products that you receive from Serving Fresh to avoid potential allergic reactions. If you have or suspect that you have an allergic reaction or other adverse health event, promptly contact your health care provider.
                    Blog posts and other Content on the Site or in the App may contain recipes, meal recommendations, dietary advice (collectively, the “Dietary Advice”) and the food products delivered in connection with the Serving Fresh Service (collectively, the “Dietary Options”) will contain various ingredients. You should always consult with your physician or other healthcare professional before adopting any Dietary Advice or partaking in any Dietary Options, whether offered by and through the Serving Fresh Offerings or otherwise. The Dietary Advice and/or Dietary Options may include ingredients that you are allergic to. You should always check the ingredients associated with any Dietary Advice and Dietary Options to avoid potential allergic reactions. If you have or suspect that you have an allergic reaction or other adverse health event, promptly contact your health care provider.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Serving Fresh Billing
                </Typography>
                <Typography className = {classes.sectionContent}>
                    When you first sign up for a subscription to a Serving Fresh Plan (a “Plan”), you are charged for the entire delivery period of your Plan selection. All Plans are continuous subscription plans, and you will be charged the applicable price listed for the Plan that you select after your current subscription is fulfilled. If you wish to cancel or modify your subscription to a Plan, you can do so at any time as described in the “Cancel or Modify a Subscription” section below; however, except as otherwise noted below, any amounts charged to or paid by you prior to such cancellation or modification will not be refunded, and cancellations or modifications may not impact any order for which you have already been charged, depending on the status of the order.
                    Serving Fresh may change the price of a Plan, introduce new Plans, or remove Plans from time to time, and will communicate any price or Plan changes to you in advance in accordance with the “Notice” section of this Agreement. Price and Plan changes will take effect as of the next billing period following the date on which Serving Fresh provided notice to you of the price or Plan change. By continuing to use the Serving Fresh Service after the effective date of a price or Plan change, you indicate your acceptance of such price or Plan change. If you do not agree with a price or Plan change, you have the right to reject the change by cancelling your subscription(s) prior to the effective date of the price or Plan change. Please make sure that you read any notifications of price or Plan changes carefully.
                    Applicable sales tax may be charged on your order based on local and state laws.
                    You are fully responsible for all activities that occur under your account, and you agree to be personally liable for all charges incurred under your account based on your delivery status as of the specified deadline. Your liability for such charges shall continue after termination of this Agreement.
                    WHEN YOU REGISTER FOR THE SERVING FRESH SUBSCRIPTION SERVICE (AND EACH TIME YOU CHANGE YOUR PLAN) YOU EXPRESSLY AUTHORIZE AND AGREE THAT SERVING FRESH AND/OR OUR THIRD PARTY PAYMENT PROCESSOR IS AUTHORIZED TO AUTOMATICALLY CHARGE YOUR PAYMENT METHOD (AS DEFINED BELOW) ON A RECURRING BASIS IN AN AMOUNT EQUAL TO THE THEN-EFFECTIVE RATE FOR YOUR PLAN, TOGETHER WITH ANY APPLICABLE TAXES AND SHIPPING (the “PLAN RATE”), FOR AS LONG AS YOU CONTINUE TO USE THE SERVING FRESH SUBSCRIPTION SERVICE, UNLESS YOU CANCEL YOUR SERVING FRESH SUBSCRIPTION SERVICE IN ACCORDANCE WITH THIS AGREEMENT. YOU ACKNOWLEDGE AND AGREE THAT SERVING FRESH WILL NOT OBTAIN ANY ADDITIONAL AUTHORIZATION FROM YOU FOR SUCH AUTOMATIC, RECURRING PAYMENTS. IN ADDITION, YOU AUTHORIZE US (AND/OR OUR THIRD PARTY PAYMENT PROCESSOR) TO CHARGE YOUR PAYMENT METHOD FOR ANY ADDITIONAL SERVING FRESH OFFERINGS PURCHASED BY YOU FROM TIME TO TIME OUTSIDE OF OR IN EXCESS OF YOUR PLAN, PLUS ANY APPLICABLE TAXES AND SHIPPING. EVERY TIME THAT YOU USE THE SERVING FRESH SUBSCRIPTION SERVICE, YOU RE-AFFIRM THAT SERVING FRESH IS AUTHORIZED TO CHARGE YOUR PAYMENT METHOD AS PROVIDED IN THE AGREEMENT, AND TO HAVE ALL APPLICABLE FEES AND CHARGES APPLIED TO SAME.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Cancel or Modify a Subscription
                </Typography>
                <Typography className = {classes.sectionContent}>
                    Following your Plan selection, order placement and receipt of your first weekly order, you may cancel or modify a subscription to a Plan at any time online by managing your account at Serving Fresh or via the App, or by emailing us at support@Serving Fresh.
                    To avoid being charged for placed orders that you no longer wish to receive in the event of a subscription cancellation, you must cancel prior to the date when you are to be charged for your next order, which is emailed to you after your receive the last delivery of your current Plan and also displayed on the Subscriptions and Order History pages. The charge is typically 1 or 2 days before your next expected delivery, depending on your specified deadline, but can vary depending on shipping length and other factors.
                    If you cancel a subscription to a Plan before receiving your first order, your first order may or may not be cancelled and related amounts paid may or may not be refunded to you, depending on factors including the status of your meals in our production process, and any promotions applied. You will be notified at the time of cancellation if any of your charged orders will be cancelled and refunded, To confirm, email us at support@Serving Fresh.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Food Substitution Policy
                </Typography>
                <Typography className = {classes.sectionContent}>
                    Although Serving Fresh takes every reasonable measure to have sufficient inventory to fill your order, availability of product(s) may change without notice. Serving Fresh is not responsible for the unavailability of product due to popular demand, whether discontinued or still in production.
                    In the completion of orders, Serving Fresh reserves the right to substitute a similar product. Substituted food items may contain different ingredients and allergens than those in items originally ordered. Prior to consumption, please be sure to carefully check all individual product packages for the most updated information regarding ingredients and nutritional content for any/all of Serving Fresh’s food products, including new and improved items, if you have any food allergies or if you are otherwise concerned about any particular ingredients.
                    Please Note: Serving Fresh’s food items may contain or may have been manufactured in a facility that also processes: dairy, eggs, fish, shellfish, soy, and tree nuts.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Shipping
                </Typography>
                <Typography className = {classes.sectionContent}>
                    We use third-party carriers (e.g. Just Delivered) to deliver your food packages and provide you with tracking information for every package. It is very important that you provide us with the proper shipping information and any special instructions that the delivery driver may need.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    App
                </Typography>
                <Typography className = {classes.sectionContent}>
                    You shall be responsible, at all times, for ensuring that you have an applicable mobile device and/or other equipment and service necessary to access the App. Serving Fresh does not guarantee the quality, speed or availability of the Internet connection associated with your mobile device. Serving Fresh does not guarantee that the App can be accessed: (a) on all mobile devices; (b) through all wireless service plans; and/or (c) in all geographical areas. Standard messaging, data and wireless access fees may apply to your use of the App. You are fully responsible for all such charges and Serving Fresh has no liability or responsibility to you, whatsoever, for any such charges billed by your wireless carrier.
                    Export/Usage Restrictions. You agree that the App may not be transferred or exported into any other country, or used in any manner prohibited by U.S. or other applicable export laws and regulations. The Serving Fresh Offerings are subject to, and you agree that you shall at all times comply with, all local, state, national and international laws, statutes, rules, regulations, ordinances and the like applicable to use of the Serving Fresh Offerings. You agree not to use the Serving Fresh Offerings: (a) for any commercial purposes; or (b) to conduct any business or activity, or solicit the performance of any activity, which is prohibited by law or any contractual provision by which you are bound.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Content
                </Typography>
                <Typography className = {classes.sectionContent}>
                    The Site and App contain Content which includes, but is not limited to, information pertaining to the Serving Fresh Offerings, as well as regularly updated blog posts and third party links. The Content is offered for informational purposes only and is at all times subject to the disclaimers contained herein, and on the Site and in the App.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Interactive Services
                </Typography>
                <Typography className = {classes.sectionContent}>
                    Subject to the restrictions set forth herein, the Interactive Services will allow users to participate in comment sections and other interactive areas of the Site and/or App. Each user agrees to use the Interactive Services in full compliance with all applicable laws and regulations. Each user shall be solely responsible for her/his comments, opinions, statements, feedback and other content (collectively, “Feedback”) posted by and through the Interactive Services. You understand and agree that Serving Fresh shall not be liable to you, any other user or any third party for any claim in connection with your use of, or inability to use, the Interactive Services. Serving Fresh does not monitor the Feedback submitted by users, and operates the comment sections of the Site and App as a neutral host. The Interactive Services contain Feedback that is provided directly by users. You agree that Serving Fresh shall have no obligation and incur no liability to you in connection with any Feedback appearing in or through the Interactive Services. Serving Fresh does not represent or warrant that the Feedback posted through the Interactive Services is accurate, complete or appropriate. Serving Fresh reserves the right to remove any Feedback from the Site and/or App at any time and for any reason, in Serving Fresh’s sole discretion.
                    You agree to use the Interactive Services in a manner consistent with any and all applicable laws and regulations. In connection with your use of the Interactive Services and other of the Serving Fresh Offerings, you agree not to: (a) display any telephone numbers, street addresses, last names, URLs, e-mail addresses or any confidential information of any third party; (b) display any audio files, text, photographs, videos or other images containing confidential information; (c) display any audio files, text, photographs, videos or other images that may be deemed indecent or obscene in your community, as defined under applicable law; (d) impersonate any person or entity; (e) “stalk” or otherwise harass any person; (f) engage in unauthorized advertising to, or commercial solicitation of, other users; (g) transmit any chain letters, spam or junk e-mail to other users; (h) express or imply that any statements that you make are endorsed by Serving Fresh, without Serving Fresh’s specific prior written consent; (i) harvest or collect personal information of other users whether or not for commercial purposes, without their express consent; (j) use any robot, spider, search/retrieval application or other manual or automatic device or process to retrieve, index, “data mine” or in any way reproduce or circumvent the navigational structure or presentation of the App, Site and/or their respective content; (k) post, distribute or reproduce in any way any copyrighted material, trademarks or other proprietary information without obtaining the prior consent of the owner of such proprietary rights; (l) remove any copyright, trademark or other proprietary rights notices contained in the App and/or Site; (m) interfere with or disrupt the App, Site and/or the servers or networks connected to same; (n) post, offer for download, e-mail or otherwise transmit any material that contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment; (o) post, offer for download, transmit, promote or otherwise make available any software, product or service that is illegal or that violates the rights of a third party including, but not limited to, spyware, adware, programs designed to send unsolicited advertisements (i.e. “spamware”), services that send unsolicited advertisements, programs designed to initiate “denial of service” attacks, mail bomb programs and programs designed to gain unauthorized access to mobile networks; (p) “frame” or “mirror” any part of the App and/or Site without Serving Fresh’s prior written authorization; (q) use metatags or code or other devices containing any reference to any Serving Fresh Offerings in order to direct any person to any other mobile application or website for any purpose; and/or (r) modify, adapt, sublicense, translate, sell, reverse engineer, decipher, decompile or otherwise disassemble any portion of the Serving Fresh Offerings or any software used in or in connection with Serving Fresh Offerings. Engaging in any of the aforementioned prohibited practices shall be deemed a breach of the Agreement and may result in the immediate termination of your access to the App and/or Site without notice, in the sole discretion of Serving Fresh. Serving Fresh reserves the right to pursue any and all legal remedies against users that engage in the aforementioned prohibited conduct.
                    By submitting or posting content to the Interactive Services, you grant Serving Fresh, its directors, officers, affiliates, subsidiaries, assigns, agents, and licensees the irrevocable, perpetual, worldwide right to reproduce, display, perform, distribute, adapt, and promote any posted content in any medium. Once you submit or post content to the Interactive Services, Serving Fresh will not give you any right to inspect or approve uses of such content or to compensate you for any such uses. Serving Fresh owns all right, title, and interest in any compilation, collective work or other derivative work, whether or not created by Serving Fresh, using or incorporating content posted to the Interactive Services. For more information, please review Serving Fresh’s Privacy Policy.
                    You are solely responsible for anything you may post on the Interactive Services. Serving Fresh will not be responsible, or liable to any third party, for the content or accuracy of any content posted by you or any other user of the Interactive Services.
                    Serving Fresh is not responsible for, and does not endorse, content in any posting made by other users on the Interactive Services. You are solely responsible for your reliance on anything posted by another user on the Interactive Services. Under no circumstances will Serving Fresh be held liable, directly or indirectly, for any loss or damage caused or alleged to have been caused to you or any third party in connection with the use of or reliance of any content posted by a third party on the Interactive Services. If you become aware of any misuse of the Sites by any person, please contact Serving Fresh at support@Serving Fresh.com.
                    If you feel threatened or believe someone else is in danger, you should contact your local law enforcement agency immediately. Serving Fresh has the right to remove any user contributions from the Interactive Services for any or no reason. Serving Fresh reserves the right to take necessary legal action against users.
                    Serving Fresh may disclose user information including personal identity and other personal information to any third party who claims that material posted by you violates their rights, including their intellectual property rights or their right to privacy. Serving Fresh has the right to cooperate with any law enforcement authorities or court order requesting or directing Serving Fresh to disclose the identity or other information of anyone posting any materials on or through the Interactive Services.
                    YOU WAIVE AND HOLD MEALFOR.ME HARMLESS FROM ANY CLAIMS RESULTING FROM ANY ACTION TAKEN BY SERVING FRESH, DURING OR AS A RESULT OF ITS INVESTIGATIONS, AND FROM ANY ACTIONS TAKEN AS A CONSEQUENCE OF INVESTIGATIONS BY SERVING FRESH, LAW ENFORCEMENT AUTHORITIES OR OTHER THIRD PARTIES.
                    Serving Fresh does not undertake to review any materials before you have posted them on the Interactive Services and cannot ensure prompt removal of objectionable material after it has been posted. Serving Fresh assumes no liability for any action or inaction regarding transmissions, communications or content provided by any user or third party. Serving Fresh shall have no liability or responsibility to anyone for performance or nonperformance of the activities described in this section.
                    Serving Fresh has the right to terminate your account and your access to the Interactive Services for any reason, including, without limitation, if Serving Fresh, in its sole discretion, considers your use to be unacceptable. Serving Fresh may, but shall not be under any obligation to, provide you a warning prior to termination of your use of the Interactive Services.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Serving Fresh Intellectual Property
                </Typography>
                <Typography className = {classes.sectionContent}>
                    The Site, App, and all associated Content, design, text, graphics, and interfaces; as well the collection, selection, and arrangement thereof; and all associated software (collectively, the “Serving Fresh Materials”), are the sole and exclusive property of, or duly licensed to, Serving Fresh. The Serving Fresh Materials are copyrighted as a collective work under the laws of the United States and other copyright laws. Serving Fresh holds the copyright in the collective work. The collective work includes works which may be property of other members. You may display and, subject to any expressly stated restrictions or limitations relating to specific material, download portions of the material from the different areas of the Site and/or App solely for your own non-commercial use, unless otherwise permitted (e.g., in the case of electronic coupons, etc.). Any redistribution, retransmission or publication of any copyrighted material is strictly prohibited without the express written consent of the copyright owner. You agree not to change or delete any proprietary notices from materials downloaded from the Site and/or the App.
                    The Serving Fresh Materials (including but not limited to all information, software, text, displays, images, video and audio, and the design, selection and arrangement thereof), are owned by Serving Fresh or its affiliates, its licensors or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.
                    This Agreement permits you access to the Site and/or the App for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works from, publicly display, publicly perform, republish, download, store or transmit any of the material on our Site and/or the App.
                    You must not (i) modify copies of any materials from the Site; (ii) use any illustrations, photographs, video or audio sequences or any graphics separately from the accompanying text, and (iii) delete or alter any copyright, trademark or other proprietary rights notices from copies of materials from the Site and/or the App. You must not access or use for any commercial purposes any part of the Site and/or the App or any services or materials available through the Site and/or the App.
                    If you print, copy, modify, download or otherwise use or provide any other person with access to any part of the Site and/or the App in breach of this Agreement, your right to use the Site and/or the App will cease immediately and you must, at our option, return or destroy any copies of the materials you have made. No right, title or interest in or to the Site and/or the App or any content on the Site and/or the App is transferred to you, and all rights not expressly granted are reserved by Serving Fresh. Any use of the Site and/or the App not expressly permitted by this Agreement is a breach of this Agreement and may violate copyright, trademark and other laws.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Trademarks
                </Typography>
                <Typography className = {classes.sectionContent}>
                    The Serving Fresh name, logo and all related names, logos, product and service names, designs and slogans are trademarks of Infinite Options LLC. or its affiliates or licensors. You must not use such marks without the prior written permission of Serving Fresh. All other names, logos, product and service names, designs and slogans on the Site and/or the App are the trademarks of their respective owners.
                    Facebook® and Instagram® are registered trademarks of Facebook, Inc. (“Facebook”). LinkedIn® is a registered trademark of LinkedIn Corporation (“LinkedIn”). Pinterest® is a registered trademark of Pinterest, Inc. (“Pinterest”). Twitter® is a registered trademark of Twitter, Inc. (“Twitter”). Snapchat® is a registered trademark of Snapchat, Inc. YouTube® is a registered trademark of Google, Inc. (“Google”). Please be advised that Serving Fresh is not in any way affiliated with Facebook, Google, LinkedIn, Pinterest or Twitter, and the Serving Fresh Offerings are not endorsed, administered or sponsored by any of those parties.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Policy/DMCA Compliance
                </Typography>
                <Typography className = {classes.sectionContent}>
                    If you believe any materials accessible on or from the Site and/or the APP infringe your copyright, you may request removal of those materials (or access thereto) from the Site and/or the App by contacting Serving Fresh (as set forth below) and providing the following information:
                    Identification of the copyrighted work that you believe to be infringed. Please describe the work and, where possible, include a copy or the location (e.g., URL) of an authorized version of the work.
                    Identification of the material that you believe to be infringing and its location. Please describe the material, and provide us with its URL or any other pertinent information that will allow us to locate the material.
                    Your name, address, telephone number, and e-mail address.
                    A statement that you have a good faith belief that the complained use of the materials is not authorized by the copyright owner, its agent, or the law.
                    A statement that the information that you have supplied is accurate, and indicating that “under penalty of perjury”, you are the copyright owner or are authorized to act on the copyright owner’s behalf.
                    A signature or the electronic equivalent from the copyright holder or authorized representative.
                    Send this information by mail to Serving Fresh, 6123 Corte de la Reina, San Jose, CA 95120, ATTN: Legal Department. In an effort to protect the rights of copyright owners, Serving Fresh maintains a policy for the termination, in appropriate circumstances, of subscribers and account holders of the Site who are repeat infringers.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Changes to the Site
                </Typography>
                <Typography className = {classes.sectionContent}>
                    Serving Fresh may update the content on the Site/and or the App from time to time, but its content is not necessarily complete or up-to-date. Any of the material on the Site may be out of date at any given time, and Serving Fresh is under no obligation to update such material.
                    Information About You and Your Visits to the Site and/or the APP
                    All information we collect on this Site and/or the App is subject to our Privacy Policy. By using the Site and/or the App, you consent to all actions taken by Serving Fresh with respect to your information in compliance with the Privacy Policy.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Online Purchases and Other Terms and Conditions
                </Typography>
                <Typography className = {classes.sectionContent}>
                    All purchases through this Site and/or the App or other transactions for the sale of goods or services or information formed through the Site and/or the App or as a result of visits made by you are governed by this Agreement.
                    Additional terms and conditions may also apply to specific portions, services or features of the Site and/or the App. All such additional terms and conditions are hereby incorporated by this reference into this Agreement.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Links from the Site and/or the App
                </Typography>
                <Typography className = {classes.sectionContent}>
                    If the Site and/or the App contains links to other sites and resources provided by third parties, these links are provided for your convenience only. This includes links contained in advertisements, including banner advertisements and sponsored links. Serving Fresh has no control over the contents of those sites or resources, and accepts no responsibility for them or for any loss or damage that may arise from your use of them. If you decide to access any of the third-party websites linked to this Site and/or the App, you do so entirely at your own risk and subject to the terms and conditions of use for such websites.
                    The Site and/or the App may include content provided by third parties, including materials provided by other users, bloggers and third-party licensors, syndicators, aggregators and/or reporting services. All statements and/or opinions expressed in these materials, and all articles and responses to questions and other content, other than the content provided by Serving Fresh, are solely the opinions and the responsibility of the person or entity providing those materials. These materials do not necessarily reflect the opinion of Serving Fresh. Serving Fresh is not responsible, or liable to you or any third party, for the content or accuracy of any materials provided by any third parties.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Warranties
                </Typography>
                <Typography className = {classes.sectionContent}>
                    THE SERVING FRESH OFFERINGS AND/OR ANY OTHER CONTENT, INFORMATION, PRODUCTS AND/OR SERVICES OFFERED BY AND THROUGH SAME ARE PROVIDED TO YOU ON AN “AS IS” AND “AS AVAILABLE” BASIS AND ALL WARRANTIES, EXPRESS AND IMPLIED STATUTORY OR OTHERWISE, ARE DISCLAIMED TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW (INCLUDING, BUT NOT LIMITED TO, THE DISCLAIMER OF ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT OF THIRD PARTIES’ RIGHTS, AND FITNESS FOR PARTICULAR PURPOSE). IN PARTICULAR, BUT NOT AS A LIMITATION THEREOF, SERVING FRESH MAKES NO WARRANTY THAT THE SERVING FRESH OFFERINGS AND/OR ANY OTHER CONTENT, INFORMATION, PRODUCTS AND/OR SERVICES OFFERED BY AND THROUGH SAME: (A) WILL MEET YOUR REQUIREMENTS; (B) WILL BE UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE OR THAT DEFECTS WILL BE CORRECTED; (C) WILL BE FREE OF HARMFUL COMPONENTS; (D) WILL RESULT IN ANY SPECIFIC DIETARY BENEFIT, WEIGHT LOSS OR OTHER HEALTH-RELATED OUTCOME; AND/OR (E) WILL BE ACCURATE OR RELIABLE. THE SERVING FRESH OFFERINGS AND/OR ANY OTHER CONTENT, INFORMATION, PRODUCTS AND/OR SERVICES OFFERED BY AND THROUGH SAME MAY CONTAIN BUGS, ERRORS, PROBLEMS OR OTHER LIMITATIONS. SERVING FRESH WILL NOT BE LIABLE FOR THE AVAILABILITY OF THE UNDERLYING INTERNET AND/OR MOBILE NETWORK CONNECTION ASSOCIATED WITH THE SERVING FRESH OFFERINGS. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM SERVING FRESH OR OTHERWISE THROUGH OR FROM THE SERVING FRESH OFFERINGS SHALL CREATE ANY WARRANTY NOT EXPRESSLY STATED IN THE AGREEMENT. WITHOUT LIMITING THE FOREGOING, SERVING FRESH DOES NOT ENDORSE USER CONTENT OR FEEDBACK AND SPECIFICALLY DISCLAIMS ANY RESPONSIBILITY OR LIABILITY TO ANY PERSON OR ENTITY FOR ANY LOSS, DAMAGE (WHETHER ACTUAL, CONSEQUENTIAL, PUNITIVE OR OTHERWISE), INJURY, CLAIM, LIABILITY OR OTHER CAUSE OF ANY KIND OR CHARACTER BASED UPON OR RESULTING FROM ANY FEEDBACK.
                    Serving Fresh makes no warranty as to the reliability, accuracy, timeliness, usefulness, adequacy, completeness or suitability of the Site and/or the App. Serving Fresh cannot and does not warrant against human and machine errors, omissions, delays, interruptions or losses, including loss of data. Serving Fresh cannot and does not guarantee or warrant that files available for downloading from the Site and/or the App will be free of infection by viruses, worms, Trojan horses, or other codes that manifest contaminating or destructive properties. Serving Fresh cannot and does not guarantee or warrant that any content you post on the Site and/or the App will remain on the Site and/or the App. Serving Fresh does not warrant or guarantee that the functions or services performed on the Site and/or the App will be uninterrupted or error-free or that defects in the Site and/or the App will be corrected.
                    Serving Fresh may disable all or any social media features and any links at any time without notice at our discretion.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Limitation of Liability
                </Typography>
                <Typography>
                    YOU EXPRESSLY UNDERSTAND AND AGREE THAT NEITHER SERVING FRESH IS TO DISCONTINUE YOUR USE OF THE SITE. SERVING FRESH, NOR ANY OF ITS DIRECTORS, OFFICERS, EMPLOYEES, SHAREHOLDERS, AFFILIATES, AGENTS, REPRESENTATIVES, THIRD-PARTY INFORMATION PROVIDERS, MERCHANTS, OR LICENSORS (COLLECTIVELY,"SERVING FRESH PARTIES") SHALL BE LIABLE TO YOU OR THIRD PARTY FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL AND/OR EXEMPLARY DAMAGES INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES, (EVEN IF SERVING FRESH OR THE APPLICABLE SERVING FRESH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), TO THE FULLEST EXTENT PERMISSIBLE BY LAW FOR: (A) THE USE OR THE INABILITY TO USE THE SERVING FRESH OFFERINGS AND/OR ANY OTHER CONTENT, INFORMATION, PRODUCTS AND/OR SERVICES OFFERED BY AND THROUGH SAME; (B) THE COST OF PROCUREMENT OF SUBSTITUTE GOODS AND SERVICES RESULTING FROM ANY GOODS, DATA, INFORMATION, CONTENT AND/OR ANY OTHER PRODUCTS PURCHASED OR OBTAINED FROM OR THROUGH THE SERVING FRESH OFFERINGS; (C) THE UNAUTHORIZED ACCESS TO, OR ALTERATION OF, YOUR ACCOUNT INFORMATION; (D) THE FAILURE TO REALIZE ANY SPECIFIC DIETARY BENEFIT, WEIGHT LOSS OR OTHER HEALTH-RELATED OUTCOME; AND/OR (E) ANY OTHER MATTER RELATING TO THE SERVING FRESH OFFERINGS AND/OR ANY OTHER CONTENT, INFORMATION, PRODUCTS AND/OR SERVICES OFFERED BY AND/OR THROUGH SAME. THIS LIMITATION APPLIES TO ALL CAUSES OF ACTION, IN THE AGGREGATE INCLUDING, BUT NOT LIMITED TO, BREACH OF CONTRACT, BREACH OF WARRANTY, NEGLIGENCE, STRICT LIABILITY, MISREPRESENTATION AND ANY AND ALL OTHER TORTS. YOU HEREBY RELEASE SERVING FRESH AND THE SERVING FRESH PARTIES FROM ANY AND ALL OBLIGATIONS, LIABILITIES AND CLAIMS IN EXCESS OF THE LIMITATIONS STATED HEREIN. IF APPLICABLE LAW DOES NOT PERMIT SUCH LIMITATIONS, THE MAXIMUM LIABILITY OF SERVING FRESH TO YOU UNDER ANY AND ALL CIRCUMSTANCES WILL BE AS SET FORTH IN THE DISPUTE RESOLUTION PROVISIONS OF THESE TERMS AND CONDITIONS. NO ACTION, REGARDLESS OF FORM, ARISING OUT OF YOUR USE OF THE SERVING FRESH OFFERINGS AND/OR ANY OTHER PRODUCTS AND/OR SERVICES OFFERED BY AND/OR THROUGH SAME, MAY BE BROUGHT BY YOU OR SERVING FRESH MORE THAN ONE (1) YEAR FOLLOWING THE EVENT WHICH GAVE RISE TO THE SUBJECT CAUSE OF ACTION. THE NEGATION OF DAMAGES SET FORTH ABOVE IS A FUNDAMENTAL ELEMENT OF THE BASIS OF THE BARGAIN BETWEEN YOU AND SERVING FRESH. ACCESS TO THE SERVING FRESH OFFERINGS AND/OR ANY OTHER CONTENT, INFORMATION, PRODUCTS AND/OR SERVICES OFFERED BY AND/OR THROUGH SAME WOULD NOT BE PROVIDED TO YOU WITHOUT SUCH LIMITATIONS. BECAUSE SOME STATES OR JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR THE LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, IN SUCH STATES OR JURISDICTIONS, SERVING FRESH’S AND ‘”THE SERVING FRESH PARTIES’ LIABILITY SHALL BE LIMITED TO THE EXTENT PERMITTED BY LAW.
                    Indemnification
                    You agree to indemnify, defend, and hold Serving Fresh, its officers, directors, employees, shareholders, affiliates agents, licensors, and suppliers, harmless from and against any claims, actions or demands, liabilities and settlements including without limitation, reasonable legal and accounting fees, resulting from, or alleged to result from, your violation of this Agreement or your use of the Serving Fresh Offerings or your use of any information obtained from the Serving Fresh Offerings.

                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Governing Law and Jurisdiction
                </Typography>
                <Typography className = {classes.sectionContent}>
                    This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of laws rules.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Resolving Disputes — Arbitration
                </Typography>
                <Typography className = {classes.sectionContent}>
                    Most customer concerns can be resolved quickly and to the customer’s satisfaction BY calling our customer service department at 1-925-400-7469. IF Serving Fresh’s customer service department is unable to resolve a complaint you may have to your satisfaction (or if Serving Fresh has not been able to resolve a dispute it has with you after attempting to do so informally), we each agree to resolve those disputes through binding arbitration or small claims court instead of in courts of general jurisdiction.
                    All disputes or claims that arise under or related to this Agreement (whether in contract, tort or otherwise, whether past, pre-existing, or future, and including statutory, consumer protection, common law, intentional tort, injunctive, and equitable claims) will be resolved either in small claims court or by individual arbitration in accordance with the rules of the American Arbitration Association ("AAA"). Unless you and Serving Fresh agree otherwise, any arbitration hearings will take place in the county (or parish) of your billing address. The AAA Rules are available online at adr.org, by calling the AAA at 1-800-778-7879. Serving Fresh agrees that it will pay a consumer’s filing fee FOR the arbitration.
                    You agree to arbitration on an individual basis. In any dispute,   NEITHER CUSTOMER NOR SERVING FRESH SHALL BE ENTITLED TO JOIN OR CONSOLIDATE CLAIMS BY OR AGAINST OTHER CUSTOMERS, OR ARBITRATE OR OTHERWISE PARTICIPATE IN ANY CLAIMS AS A REPRESENTATIVE, CLASS MEMBER, OR IN A PRIVATE ATTORNEY GENERAL CAPACITY. If any provision of this arbitration agreement is found unenforceable, the unenforceable provision shall be severed, and the remaining arbitration terms shall be enforced (but in no case shall there be a class arbitration).  
                    The arbitrator shall be empowered to grant whatever relief would be available in court under law. Any award of the arbitrator shall be final and binding on each of the parties, and may be entered as a judgment in any court of competent jurisdiction. This transaction and the arbitration shall be governed by the Federal Arbitration Act 9 U.S.C. sec. 1-16 (FAA).
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Waiver and Severability
                </Typography>
                <Typography className = {classes.sectionContent}>
                    No waiver by Serving Fresh of any of the terms and conditions set forth in this Agreement shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of Serving Fresh to assert a right or provision under these Terms and Conditions shall not constitute a waiver of such right or provision.
                    If any provision of this Agreement is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of this Agreement will continue in full force and effect.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Entire Agreement
                </Typography>
                <Typography className = {classes.sectionContent}>
                    This Agreement and our Privacy Policy constitute the sole and entire agreement between you and Serving Fresh with respect to the Serving Fresh Offerings and supersede all prior and contemporaneous understandings, agreements, representations and warranties, both written and oral, with respect to the Serving Fresh Offerings.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Notice
                </Typography>
                <Typography className = {classes.sectionContent}>
                    Serving Fresh may deliver notice to you under this Agreement by means of electronic mail, a general notice on the site, or by written communication delivered by first class U.S. mail to your address on record in your Serving Fresh account. You may give notice to Serving Fresh at any time via electronic mail or by letter delivered by first class postage prepaid U.S. mail or overnight courier to the following address: Serving Fresh, 6123 Corte de la Reina, San Jose CA 95120, Attn: Legal Department.
                </Typography>
                
                <Typography className = {classes.sectionTitle}>
                    Telephone Calls and SMS Text Messages
                </Typography>
                <Typography className = {classes.sectionContent}>
                    Upon registration for an account, you will be asked to provide us with a telephone number at which we can reach you. That number is required for shipping and so that Serving Fresh can reach you with informational calls related to your transactions. The frequency of text messages that we send to you depends on your transactions with us and you consent to receive text messages sent through an automatic telephone dialing system. All calls to and from Serving Fresh may be monitored or recorded for quality and training purposes.

                    If you elect to receive text messages about your account, we may also send you promotional text messages and you consent to receive recurring SMS text messages sent through an automatic telephone dialing system. This service is optional, and is not a condition of purchase. You can opt out of receiving SMS messages at any time by texting STOP in response. Message and data rates may apply. We will treat data collected through text messages in accordance with our Privacy Policy.
                    All charges are billed by and payable to your wireless service provider. Please contact your wireless service provider for pricing plans and details. If you wish to opt out of such text messages, you may do so by following the "opt-out" instructions in the text message, or by editing your account settings. Message and data rates may apply. We will treat data collected through text messages in accordance with our Privacy Policy.
                </Typography>
            </Box>
        </Dialog>
    );
}