//
//  customController.m
//  DFP
//
//  Created by Raghuveer Subodha on 09/09/14.
//  Copyright (c) 2014 Appcellence. All rights reserved.
//

#import "customController.h"


@interface customController () {
    NSArray *categoryPics;
}

@end


@implementation customController

    - (void)viewDidLoad {
        [super viewDidLoad];
        categoryPics = [NSArray arrayWithObjects:@"category1.jgp",@"category2.jpg",@"category3.jpg", nil];
        // Do any additional setup after loading the view, typically from a nib.
    }

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return categoryPics.count;
}

-(UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *identifier = @"categoryCell";
    
    UICollectionViewCell *categoryCell = [collectionView dequeueReusableCellWithReuseIdentifier:identifier forIndexPath:indexPath];
    UIImageView *categoryPicsView = (UIImageView *)[categoryCell viewWithTag:100];
    categoryPicsView.image = [UIImage imageNamed:[categoryPics objectAtIndex:indexPath.row]];
    
    return categoryCell;
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
