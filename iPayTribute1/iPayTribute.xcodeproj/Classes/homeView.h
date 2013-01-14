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
	IBOutlet UIImageView *productImg;
	IBOutlet UILabel *descriptionText;
}

@property (nonatomic, retain) IBOutlet UILabel *cellText;
@property (nonatomic, retain) IBOutlet UIImageView *productImg;
@property (nonatomic, retain) IBOutlet UILabel *descriptionText;

- (void)setLabelText:(NSString *)_text;
- (void)setDescpText:(NSString *)_text;
- (void)setProductImage:(NSString *)_text;

@end
