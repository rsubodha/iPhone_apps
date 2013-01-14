//
//  PerfectValentineViewController.h
//  PerfectValentine
//
//  Created by Meenakshi Subodha on 08/02/10.
//  Copyright __MyCompanyName__ 2010. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "homeView.h"

@interface PerfectValentineViewController : UIViewController <UITableViewDelegate, UITableViewDataSource> {
	
	NSArray *arryData;
	NSArray *imagesList;
	NSArray *biggerImage;
	NSArray *descpList;
	NSArray *imagenames;
	NSArray *detailedDescp;
	IBOutlet UITableView *tblSimpleTable;
	IBOutlet homeView *tblCell;
	
}

@end

