//
//  mailer.m
//  iPayTribute
//
//  Created by Raghuveer Subodha on 08/10/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "mailer.h"


@implementation mailer;

/*
- (id)initWithStyle:(UITableViewStyle)style {
    // Override initWithStyle: if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
    if (self = [super initWithStyle:style]) {
    }
    return self;
}
*/

- (void)viewDidLoad {
    [super viewDidLoad];

    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    // self.navigationItem.rightBarButtonItem = self.editButtonItem;
}
-(IBAction) clickButton: (id) sender
{
	
}
/*
{
		Class mailclass = (NSClassFromString(@"MFMailComposeViewController"));
	if(mailclass !=nil) {
		if ([mailclass canSendMail]) {
			[self displayComposerSheet];
			//[self launchMailAppOnDevice];
		} else {
			[self launchMailAppOnDevice];
		}
	} else {
		[self launchMailAppOnDevice];
	}
	
}

-(void) launchMailAppOnDevice
 {
 
 NSString *recepients=@"mailto:someone@example.com?cc=someone@example.com&subject=Valentine Greetings !!";
 NSString *body=detailsInfo;
 
 NSString *email = [NSString stringWithFormat:@"%@%@", recepients, body];
 email = [email stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
 [[UIApplication sharedApplication] openURL:[NSURL URLWithString:email]];
 }

- (void)displayComposerSheet {
	
	//- (IBAction)addAction:(id)sender
	//{
	
	MFMailComposeViewController *picker =[[MFMailComposeViewController alloc] init];
	picker.mailComposeDelegate=self;
	
	[picker setSubject:@"Hearty Condolence"];
	//NSString *emailBody = detailsInfo;
	
	//NSString *path = [[NSBundle mainBundle] pathForResource:fileplaceHolder ofType:@"png"];
	//UIImage *image = [UIImage imageWithContentsOfFile:path];
	//NSData *myData = UIImagePNGRepresentation(image);
	
	//[picker addAttachmentData:myData mimeType:@"png" fileName:@"Greetings.png"];
	//[picker setMessageBody:emailBody isHTML:NO];
	[self presentModalViewController:picker animated:YES];
	[picker release];
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
*/

/*
- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
}
*/
/*
- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
}
*/
/*
- (void)viewWillDisappear:(BOOL)animated {
	[super viewWillDisappear:animated];
}
*/
/*
- (void)viewDidDisappear:(BOOL)animated {
	[super viewDidDisappear:animated];
}
*/

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
}


#pragma mark Table view methods

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}


// Customize the number of rows in the table view.
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return 0;
}


// Customize the appearance of table view cells.
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *CellIdentifier = @"Cell";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier] autorelease];
    }
    
    // Set up the cell...
	
    return cell;
}


- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    // Navigation logic may go here. Create and push another view controller.
	// AnotherViewController *anotherViewController = [[AnotherViewController alloc] initWithNibName:@"AnotherView" bundle:nil];
	// [self.navigationController pushViewController:anotherViewController];
	// [anotherViewController release];
}


/*
// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    // Return NO if you do not want the specified item to be editable.
    return YES;
}
*/


/*
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath {
    
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [tableView deleteRowsAtIndexPaths:[NSArray arrayWithObject:indexPath] withRowAnimation:YES];
    }   
    else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}
*/


/*
// Override to support rearranging the table view.
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath {
}
*/


/*
// Override to support conditional rearranging of the table view.
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath {
    // Return NO if you do not want the item to be re-orderable.
    return YES;
}
*/


- (void)dealloc {
    [super dealloc];
}


@end

