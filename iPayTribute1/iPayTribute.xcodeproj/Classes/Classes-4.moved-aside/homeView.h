//
//  homeView.h
//  iPayTribute
//
//  Created by Raghuveer Subodha on 12/10/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface homeView : UITableViewCell {

	IBOutlet UILabel *cellText;
	IBOutlet UIImageView *sJobsImg;
	IBOutlet UILabel *descriptionText;
}

@property (nonatomic, retain) IBOutlet UILabel *cellText;
@property (nonatomic, retain) IBOutlet UIImageView *sJobsImg;
@property (nonatomic, retain) IBOutlet UILabel *descriptionText;

- (void)setCategories:(NSString *)_text;
- (void)setDescriptionText:(NSString *)_text;
- (void)setImages:(NSString *)_text;

@end
