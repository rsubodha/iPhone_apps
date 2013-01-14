//
//  FirstViewController.h
//  iPayTribute
//
//  Created by Raghuveer Subodha on 07/10/11.
//  Copyright __MyCompanyName__ 2011. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MessageUI/MessageUI.h>
#import <MessageUI/MFMailComposeViewController.h>
#import "homeView.h"
#import "imageXMLView.h"
#import "imageXMLElement.h"

@interface FirstViewController : UIViewController <MFMailComposeViewControllerDelegate,UIActionSheetDelegate, UITableViewDelegate, UITableViewDataSource>{

	IBOutlet UIScrollView *mscrollView;
	IBOutlet UIScrollView *secondscrollView;
	IBOutlet UIButton *postButton;
	IBOutlet UILabel *message;
	IBOutlet UIView *page1;
	IBOutlet UIView *page2;
	IBOutlet UIView *page3;
	IBOutlet UIPageControl *pageControl;
	IBOutlet UILabel *labelPage1;
	IBOutlet UILabel *labelPage2;
	IBOutlet UILabel *labelPage3;
	
	//for gallery
	NSArray *listData;
	NSArray *array;
	NSArray *array1;
	NSArray *array2;
	NSString *alertMessage;
	
	
	IBOutlet UITableView *tblSimpleTable;
	IBOutlet homeView *tblCell;	
	
	// for xml parser start
	
	IBOutlet UIScrollView *scrollView;
	
	NSXMLParser *parser;
	NSMutableString *currentAttribute;
	NSMutableArray *xmlElementObjects;
	
	imageXMLElement *tempElement;
	
	IBOutlet UIImageView *imageView;
	IBOutlet UILabel *imageTltle;


	// for xml parser end
	
}

@property (nonatomic, retain) IBOutlet UIScrollView *mscrollView;
@property (nonatomic, retain) IBOutlet UIScrollView *secondscrollView;
@property (nonatomic, retain) IBOutlet UIButton *postButton;
@property (nonatomic, retain) IBOutlet UILabel *message;

@property (nonatomic, retain) NSArray *listData;

@property (nonatomic, retain) NSArray *array;
@property (nonatomic, retain) NSArray *array1;
@property (nonatomic, retain) NSArray *array2;
@property (nonatomic,retain) NSString *alertMessage;

@property (nonatomic,retain) IBOutlet UILabel *labelPage1;
@property (nonatomic,retain) IBOutlet UILabel *labelPage2;
@property (nonatomic,retain) IBOutlet UILabel *labelPage3;

// for xml parser start

@property (nonatomic, retain) IBOutlet UIScrollView *scrollView;

@property (nonatomic, retain) NSXMLParser *parser;
@property (nonatomic, retain) NSMutableString *currentAttribute;
@property (nonatomic, retain) NSMutableArray *xmlElementObjects;
@property (nonatomic, retain) imageXMLElement *tempElement;

-(void)layoutScrollView;


// for xml parser end


-(IBAction)buttonPress:(id)sender;
-(void)displayComposerSheet;
-(void)launchMailAppOnDevice;

- (void) changePage:(id) sender;


@end
