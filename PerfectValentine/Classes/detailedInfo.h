//
//  detailedInfo.h
//  PerfectValentine
//
//  Created by Meenakshi Subodha on 08/02/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MessageUI/MessageUI.h>
#import <MessageUI/MFMailComposeViewController.h>

@interface detailedInfo : UIViewController <MFMailComposeViewControllerDelegate,UIActionSheetDelegate> {

	IBOutlet UILabel *lblProductTxt;
	//IBOutlet UILabel *detailsInfo;
	NSString *detailsInfo;
	IBOutlet UILabel *textDisplay;
	NSString *fileplaceHolder;
	IBOutlet UIImageView *images;
	//IBOutlet UIScrollView *scrollView;
	
}

- (IBAction) changeProductText:(NSString *)str;
- (IBAction) setImage:(NSString *)str1;
- (IBAction) setDtldInfo:(NSString *)text;
- (IBAction) setImagefilename:(NSString *)text1;

//-(IBAction)showPicker:(id)sender;
-(void)displayComposerSheet;
-(void)launchMailAppOnDevice;

@end
