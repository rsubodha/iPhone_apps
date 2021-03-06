//
//  homeView.m
//  iPayTribute
//
//  Created by Raghuveer Subodha on 12/10/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "homeView.h"


@implementation homeView
@synthesize cellText;
@synthesize sJobsImg;
@synthesize descriptionText;


- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    if (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier]) {
        // Initialization code
    }
    return self;
}


- (void)setSelected:(BOOL)selected animated:(BOOL)animated {

    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}


- (void)dealloc {
	[cellText release];
	[sJobsImg release];
	[descriptionText release];
    [super dealloc];
}

- (void)setCategories:(NSString *)_text;{
	cellText.text = _text;
}

- (void)setDescriptionText:(NSString *)_text;{
	descriptionText.text = _text;
}

- (void)setImages:(NSString *)_text;{
	sJobsImg.image = [UIImage imageNamed:_text];
}

@end
