//
//  PerfectValentineViewController.m
//  PerfectValentine
//
//  Created by Meenakshi Subodha on 08/02/10.
//  Copyright __MyCompanyName__ 2010. All rights reserved.
//

#import "PerfectValentineViewController.h"
#import "homeView.h"
#import "detailedInfo.h"

@implementation PerfectValentineViewController


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



- (void)viewDidLoad {
	
	[super viewDidLoad];
	
	arryData = [[NSArray alloc] initWithObjects:@"A Solitare Rose", @"Bunch of Roses", @"Blooming Roses", @"Virgin Rose", @"Shades of Roses", @"Romonatic Roses", @"Beautiful Roses", nil];
	imagesList = [[NSArray alloc] initWithObjects:@"solitareRose.png", @"bunchofRoses.png", @"bloomingRose.png", @"virginRose.png", @"shadesofRoses.png", @"comboRose.png",@"beautifulRose.png",nil];
	descpList = [[NSArray alloc] initWithObjects:@"just thinking about you",@"to our loving Pair", @"for our blossoming love",@"for a new journey", @"your smile means a lot", @"for our deep love", @"for our beautiful memories", nil];
	biggerImage=[[NSArray alloc] initWithObjects:@"solitareRose_bigger.png",@"bunchofRoses_bigger.png",@"bloomingRose_bigger.png",@"virginRose_bigger.png",@"shadesofRoses_bigger.png",@"comboRose_bigger.png",@"beautifulRose_bigger.png",nil];
	imagenames=[[NSArray alloc] initWithObjects:@"solitareRose_bigger", @"bunchofRoses_bigger", @"bloomingRose_bigger", @"virginRose_bigger", @"shadesofRoses_bigger", @"comboRose_bigger",@"beautifulRose_bigger",nil];
	detailedDescp=[[NSArray alloc] initWithObjects:@"My days are filled with sweet memories. The memories that made the moments  special; Let me make it even more sweet and bright with a Red rose that makes you smile.",
												   @"We are wrapped together in love. We make a happy pair that’s for sure; But still I want to say “I Love You”. So here is a bunch of special  roses only for you.",
												   @"We share our love, We share our feelings; Let us celebrate this day together with joy. Cherish this day for ever and I wish to say I do care more than you know.",
												   @"Words are not full, sentences cannot explain. Such is the love, that only a red rose can express my feelings to you. You’re very special,to me you're unique.I can only say..“I Love You” ",
												   @"These roses are specially for you. What brightens them up is a smile from you.My heart feels happy when you are with me.The world brightens when you smile at me.",
												   @"Romance in the air is only fair with these special roses that are there.I love you Sweetheart from deepest of my heart. May this Day be filled with loads of love and life.",
												   @"Sweet memories of you are always with me. let me sweeten it more with special beautiful roses.I treasure our love and treasure our life.Let the special bond of love be for ever.", nil];
	
	self.title = @"Perfect Valentine";
	
    
	
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
	
}


- (void)dealloc {
	[arryData release];
	[imagesList release];
	[descpList release];
	[biggerImage release];
	[imagenames release];
	[detailedDescp release];
    [super dealloc];
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}


// Customize the number of rows in the table view.
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [arryData count];
}


// Customize the appearance of table view cells.
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
	/* 
	 static NSString *CellIdentifier = @"Cell";
	 
	 UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
	 if (cell == nil) {
	 cell = [[[UITableViewCell alloc] initWithFrame:CGRectZero reuseIdentifier:CellIdentifier] autorelease];
	 }
	 
	 // Set up the cell...
	 cell.text = [arryData objectAtIndex:indexPath.row];
	 return cell;*/
	static NSString *MyIdentifier = @"MyIdentifier";
	MyIdentifier = @"homeView";
	
	homeView *cell = (homeView *)[tableView dequeueReusableCellWithIdentifier:MyIdentifier];
	if(cell == nil) {
		[[NSBundle mainBundle] loadNibNamed:@"homeView" owner:self options:nil];
		cell = tblCell;
	}
	
	[cell setLabelText:[arryData objectAtIndex:indexPath.row]];
	[cell setProductImage:[imagesList objectAtIndex:indexPath.row]];
	[cell setDescpText:[descpList objectAtIndex:indexPath.row]];
	return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
	detailedInfo *detail = [[detailedInfo alloc] initWithNibName:@"detailedView" bundle:nil];

	[self.navigationController pushViewController:detail animated:YES];
	[detail changeProductText:[arryData objectAtIndex:indexPath.row]];
	[detail setImage:[biggerImage objectAtIndex:indexPath.row]];
	[detail setDtldInfo:[detailedDescp objectAtIndex:indexPath.row]];
	[detail setImagefilename:[imagenames objectAtIndex:indexPath.row]];
	
}

@end
