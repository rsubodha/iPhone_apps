//
//  FirstViewController.m
//  iPayTribute
//
//  Created by Raghuveer Subodha on 07/10/11.
//  Copyright __MyCompanyName__ 2011. All rights reserved.
//

#import "FirstViewController.h"
#import "homeView.h"


#import "imageXMLView.h"
#import "imageXMLElement.h"

@implementation FirstViewController;

@synthesize mscrollView;
@synthesize secondscrollView;
@synthesize postButton;
@synthesize message;

//for gallery
@synthesize array;
@synthesize array1;
@synthesize array2;

@synthesize listData;

@synthesize alertMessage;

@synthesize labelPage1;
@synthesize labelPage2;
@synthesize labelPage3;


// for xml parser start

@synthesize scrollView;

@synthesize parser;
@synthesize currentAttribute;
@synthesize xmlElementObjects;

@synthesize tempElement;

// for xml parser end


- (void) changePage:(id) sender;
{
	switch ([pageControl currentPage]) {
		case 0:
			[page2 removeFromSuperview];
			[page3 removeFromSuperview];
			[[self view] addSubview:page1];
			break;
		case 1:
			[page1 removeFromSuperview];
			[page3 removeFromSuperview];
			[[self view] addSubview:page2];
			break;
		case 2:
			[page1 removeFromSuperview];
			[page2 removeFromSuperview];
			[[self view] addSubview:page3];
			break;
		default:
			break;
	}
}


- (void)viewWillAppear:(BOOL)animated {
	/*[super viewWillAppear:animated];
	
	[[NSNotificationCenter defaultCenter] addObserver: self 
											 selector: @selector(keyboardWasShown:)
												 name: UIKeyboardDidShowNotification 
											   object: nil];
	
	[[NSNotificationCenter defaultCenter] addObserver: self
											 selector: @selector(keyboardWasHidden:)
												 name: UIKeyboardDidHideNotification 
											   object: nil];
	*/
	//mscrollView.frame = CGRectMake(0, 0, 800, 220);
	mscrollView.contentSize = CGSizeMake(500, 220);
	//mscrollView1.frame = CGRectMake(0,50,600,70);
	//secondscrollView.contentSize = CGSizeMake(600, 70);


}


/*
// The designated initializer. Override to perform setup that is required before the view is loaded.
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


 //Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad 
{
	
	
	array = [[NSArray alloc] initWithObjects:@"Pictures",@"Videos",@"Articles",nil];
	array1 = [[NSArray alloc] initWithObjects:@"sJobs_gallery_icon.png",@"sJobs_gallery_icon.png",@"sJobs_gallery_icon.png",nil];
	array2 = [[NSArray alloc] initWithObjects:@"Host of rare pictures from awesome collection.... ", @"Host of rare videos and Keynote speeches....",@"Host of interesting articles....",nil];
	self.listData = array;
	
	[super viewDidLoad];

	
	xmlElementObjects = [[NSMutableArray alloc] init];
	
	parser = [[NSXMLParser alloc] initWithContentsOfURL:[NSURL URLWithString:@"http://dl.dropbox.com/u/16386001/iPayTributeImageXML.xml"]];
	
	[parser setDelegate:self];
	[parser parse];
}

// for xml parser start
- (void)parser:(NSXMLParser *)parser didStartElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qName attributes:(NSDictionary *)attributeDict
{
	if(![elementName compare:@"PictureInfo"])
	{
		tempElement = [[imageXMLElement alloc] init];
	}
	
	else if(![elementName compare:@"imageURL"])
	{
		currentAttribute = [NSMutableString string];
	}
	
	else if(![elementName compare:@"imageTitle"])
	{
		currentAttribute = [NSMutableString string];
	}
}

- (void)parser:(NSXMLParser *)parser didEndElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qName
{
	if(![elementName compare:@"PictureInfo"])
	{
		[xmlElementObjects addObject:tempElement];
	}
	
	else if(![elementName compare:@"imageURL"])
	{
		NSURL *imageURL = [NSURL URLWithString:currentAttribute];
		NSData *data = [NSData dataWithContentsOfURL:imageURL];
		UIImage *image = [[UIImage alloc] initWithData:data];
		
		[tempElement setImage:image];
	} 
	
	else if(![elementName compare:@"imageTitle"])
	{
		NSLog(@"ImageTitle %@", currentAttribute);
		
		[tempElement setImageTitle:currentAttribute];
	}
	
	else if(![elementName compare:@"Pictures"])
	{
		[self layoutScrollView];
	}
}

- (void)parser:(NSXMLParser *)parser foundCharacters:(NSString *)string
{
	if(self.currentAttribute)
	{
		[self.currentAttribute appendString:string];
 	}
}

-(void)layoutScrollView
{
	CGRect workingFrame;
	
	workingFrame.origin.x = 0;
	workingFrame.origin.y = 0;
	workingFrame.size.width = 320;
	workingFrame.size.height = 480;
	
	imageXMLView *myView;
	
	for(imageXMLElement *element in [self xmlElementObjects])
	{
		myView = [[imageXMLView alloc] initWithFrame:workingFrame];
		
		NSLog(@"Element title is: %@", [element imageTitle]);
		
		NSArray *topLevelObjects= [[NSBundle mainBundle] loadNibNamed:@"ThirdView" owner:nil options:nil];
		
		for(id currentObject in topLevelObjects)
		{
			if([currentObject isKindOfClass:[imageXMLView class]])
			{
				myView = (imageXMLView *)currentObject;
			}
		}		
		
		[[myView imageView] setImage:[element image]];
		[[myView imageTltle] setText:[element imageTitle]];
		[myView setFrame:workingFrame];
		
		[scrollView addSubview:myView];
		
		workingFrame.origin.x = workingFrame.origin.x + 320; 
	}
	
	workingFrame.size.width = workingFrame.origin.x;
	[scrollView setContentSize:workingFrame.size];
	
	workingFrame.origin.x = 0;
	workingFrame.origin.y = 0;
	workingFrame.size.width = 320;
	workingFrame.size.height = 480;
	
	[scrollView setFrame:workingFrame];
}

// for xml parser end


// when the post condoloence button triggers
-(IBAction)buttonPress:(id)sender
{

	Class mailClass = (NSClassFromString(@"MFMailComposeViewController"));
	if(mailClass != nil)
	{
		if([mailClass canSendMail])
		{
			[self displayComposerSheet];
		}else {
			[self launchMailAppOnDevice];
		}
	} 
	else {
		[self launchMailAppOnDevice];
	}
	
}
// to display the mail composer sheet
-(void)displayComposerSheet
{
	MFMailComposeViewController *picker = [[MFMailComposeViewController alloc] init];
	picker.mailComposeDelegate = self;
	[picker setSubject:@"Hearty Condolence"];
	
	NSArray *toRecepients = [NSArray arrayWithObject:@"Someone@apple.com"];
	[picker setToRecipients:toRecepients];
	
	NSString *emailBody = @"Some defaut text goes here....";
	[picker setMessageBody:emailBody isHTML:NO];
	
	[self presentModalViewController:picker animated:YES];
    [picker release];
}
// to launch email app

-(void)launchMailAppOnDevice
{
    NSString *recipients = @"mailto:omeone@apple.com&subject=Hello from California!";
    NSString *body = @"&body=It is raining in sunny California!";
    
    NSString *email = [NSString stringWithFormat:@"%@%@", recipients, body];
    email = [email stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:email]];
}

//take control on the result of posting
- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error 
{   
    switch (result)
	{
		case MFMailComposeResultCancelled:
			[self dismissModalViewControllerAnimated:YES];
			break;
		case MFMailComposeResultSent:
		{
			UIActionSheet *actionSheet = [[UIActionSheet alloc] initWithTitle:@"Your Message is on its way.... Do you want to write this on your wall?" delegate:self cancelButtonTitle:@"I'll do later" destructiveButtonTitle: @"Yes, Post it now" otherButtonTitles:nil];
			[actionSheet showInView:self.view];
			[actionSheet release];
		}
			break;
	}
}
//for actions beyond posting
- (void) actionSheet:(UIActionSheet *) callActionSheet didDismissWithButtonIndex:(NSInteger)buttonIndex {
	
	if (!(buttonIndex ==[callActionSheet cancelButtonIndex])){
		[[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"http://wwww.facebook.com"]];
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

- (void)didReceiveMemoryWarning {
	// Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
	
	// Release any cached data, images, etc that aren't in use.
}

- (void)viewDidUnload {
	// Release any retained subviews of the main view.
	// e.g. self.myOutlet = nil;
	self.message = nil;
	
}

- (void)dealloc {
	[message release];
	[array release];
	[array1 release];
	[array2 release];
    [super dealloc];
}

- (NSInteger) tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
	//return [array count];
	return 3;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{	
	static NSString *tableexampleIdentifier= @"tableexampleIdentifier";
	tableexampleIdentifier = @"homeView";
	
	
	homeView *cell = (homeView *)[tableView dequeueReusableCellWithIdentifier:tableexampleIdentifier];
	if(cell == nil) {
		
		[[NSBundle mainBundle] loadNibNamed:@"homeView" owner:self options:nil];
		cell = tblCell;
		
		
	}
	
	[cell setLabelText:[array objectAtIndex:indexPath.row]];
	[cell setProductImage:[array1 objectAtIndex:indexPath.row]];
	[cell setDescpText:[array2 objectAtIndex:indexPath.row]];
	return cell;
	 
}


- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath: (NSIndexPath *)indexPath
{
	NSUInteger row = [indexPath row];
	NSString *rowValue = [array objectAtIndex:row];
	//UIAlertView *alert;
	
	//NSString *message = [[NSString alloc] initWithFormat:@"You Selected %@", rowValue];
	//UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Row Selected!" message:message delegate:nil cancelButtonTitle:@"Yes I Did" otherButtonTitles:nil];

	if (rowValue ==@"Pictures")
	{
		
		//[[NSBundle mainBundle] loadNibNamed:@"imageXMLView" owner:self options:nil];
		// for xml parser
		[self layoutScrollView];
	}
	if (rowValue == @"Videos")
	{
		NSString *stringURL = @"http://www.youtube.com/results?search_query=steve+jobs&aq=f&aql=t";
		NSURL *url = [NSURL URLWithString:stringURL];
		[[UIApplication sharedApplication] openURL:url];
		
	} else
	{
		//alertMessage = [[NSString alloc] initWithFormat:@"You Selected %@", rowValue];
		//alert = [[UIAlertView alloc] initWithTitle:@"Row Selected!" message:alertMessage delegate:nil cancelButtonTitle:@"Yes I Did" otherButtonTitles:nil];
		//[alert show];
		//[message release];
		//[alert release];
	}
	
}		

@end
