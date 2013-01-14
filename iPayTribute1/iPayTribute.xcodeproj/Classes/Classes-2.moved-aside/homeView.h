//
//  homeView.h
//  iPayTribute
//
//  Created by Raghuveer Subodha on 09/10/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface homeView : UITableViewController {
	IBOutlet UILabel *cellText;
	IBOutlet UIImageView *artifactImg;
	IBOutlet UILabel *descriptionText;
}

- (void)setLabelText:(NSString *)_text;
- (void)setDescpText:(NSString *)_text;
- (void)setartifactImage:(NSString *)_text;

@end
