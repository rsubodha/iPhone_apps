//
//  imageXMLElement.h
//  iPayTribute
//
//  Created by Raghuveer Subodha on 23/10/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface imageXMLElement : NSObject {

	UIImage *image;
	NSString *imageTitle;
}

@property (nonatomic, retain) UIImage *image;
@property (nonatomic, retain) NSString *imageTitle;

@end
