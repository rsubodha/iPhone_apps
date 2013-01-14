//
//  detailedInfo.m
//  PerfectValentine
//
//  Created by Meenakshi Subodha on 08/02/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "detailedInfo.h"
#import "PerfectValentineViewController.h"

@implementation detailedInfo;

/*
 // The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    if (self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil]) {
        // Custom initialization
    }
    return self;
}
*/

/*
// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
}
*/
- (IBAction) changeProductText:(NSString *)str{
	lblProductTxt.text = str;
}

- (IBAction) setImage:(NSString *)str1{
	images.image = [UIImage imageNamed:str1];
}

- (IBAction) setDtldInfo:(NSString *)text{
	detailsInfo=text;
	textDisplay.text=detailsInfo;
}

- (IBAction) setImagefilename:(NSString *)text1 {
	fileplaceHolder=text1;
}


- (void)viewDidLoad {

    self.title=@"Rose Info";
	
	UIBarButtonItem *addButton = [[[UIBarButtonItem alloc] initWithTitle:NSLocalizedString(@"Send", @"")
																  style:UIBarButtonItemStyleBordered
																  target:self
																  action:@selector(addAction:)] autorelease];
	
	self.navigationItem.rightBarButtonItem = addButton;
	//[detailsInfo sizeToFit];
	//textDisplay.text=detailsInfo;
	
	//lblProductTxt.text=detailsInfo.text;
	
	//[detailsInfo sizeToFit];
	//[scrollView setContentSize:detailsInfo.frame.size];
	//[detailedView setContentSize:detailsInfo.frame.size];
	[super viewDidLoad];

}

//-(IBAction)showPicker:(id)sender 
-(IBAction) addAction: (id) sender
{
	Class mailclass = (NSClassFromString(@"MFMailComposeViewController"));
	
	if(mailclass !=nil) {
		if ([mailclass canSendMail]) {
			[self displayComposerSheet];
		} else {
			[self launchMailAppOnDevice];
		}
	} else {
		[self launchMailAppOnDevice];
	}
}

- (void)displayComposerSheet {
	

	
//- (IBAction)addAction:(id)sender
//{
	
	MFMailComposeViewController *picker =[[MFMailComposeViewController alloc] init];
	picker.mailComposeDelegate=self;
	
	[picker setSubject:@"Valentine Greetings !!"];
	NSString *emailBody = detailsInfo;
	
	NSString *path = [[NSBundle mainBundle] pathForResource:fileplaceHolder ofType:@"png"];
	UIImage *image = [UIImage imageWithContentsOfFile:path];
	NSData *myData = UIImagePNGRepresentation(image);
	
	[picker addAttachmentData:myData mimeType:@"png" fileName:@"Greetings.png"];
	[picker setMessageBody:emailBody isHTML:NO];
	[self presentModalViewController:picker animated:YES];
	[picker release];
}

-(void) launchMailAppOnDevice
{
	NSString *recepients=@"mailto:someone@example.com?cc=someone@example.com&subject=Valentine Greetings !!";
	NSString *body=detailsInfo;
	
	NSString *email = [NSString stringWithFormat:@"%@%@", recepients, body];
	email = [email stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
	[[UIApplication sharedApplication] openURL:[NSURL URLWithString:email]];
}

- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error 
{	
	
	switch (result)
	{
		case MFMailComposeResultCancelled:
			[self dismissModalViewControllerAnimated:YES];
			break;
		case MFMailComposeResultSent:
		{
			UIActionSheet *actionSheet = [[UIActionSheet alloc] initWithTitle:@"Your Message is on its way.... want to write a review on the app!!" delegate:self cancelButtonTitle:@"I'll do later" destructiveButtonTitle: @"Sure, I'll do" otherButtonTitles:nil];
			[actionSheet showInView:self.view];
			[actionSheet release];
		}
			break;
	}
}

- (void) actionSheet:(UIActionSheet *) actionSheet didDismissWithButtonIndex:(NSInteger)buttonIndex {
	
	if (!(buttonIndex ==[actionSheet cancelButtonIndex])){
		[[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"http://sites.google.com/site/prysmtechnologies/contact-us"]];
		[self dismissModalViewControllerAnimated:YES];
	}
	else {
		[self dismissModalViewControllerAnimated:NO];
		[self.navigationController popToRootViewControllerAnimated:YES];
	}
	
}

/*
// Override to allow orientations other than the default portrait orientation.
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    // Return YES for supported orientations
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}
*/

/*
- (void)didReceiveMemoryWarning {
	// Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
	
	// Release any cached data, images, etc that aren't in use.
}

- (void)viewDidUnload {
	// Release any retained subviews of the main view.
	// e.g. self.myOutlet = nil;
}
*/

- (void)dealloc {
    [textDisplay release];
	[super dealloc];
}


@end
