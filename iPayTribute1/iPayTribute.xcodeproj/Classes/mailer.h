//
//  mailer.h
//  iPayTribute
//
//  Created by Raghuveer Subodha on 08/10/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MessageUI/MessageUI.h>
#import <MessageUI/MFMailComposeViewController.h>

@interface mailer : UIViewController <MFMailComposeViewControllerDelegate,UIActionSheetDelegate> {
NSString *detailsInfo;
	
}


//for sending mail
-(void)displayComposerSheet;
-(void)launchMailAppOnDevice;

@end
