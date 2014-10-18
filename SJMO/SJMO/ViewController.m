//
//  ViewController.m
//  SJMO
//
//  Created by Raghuveer Subodha on 02/10/14.
//  Copyright (c) 2014 Appcellence. All rights reserved.
//

#import "ViewController.h"
#import "servicesViewController.h"
#import "aboutUSViewController.h"

@interface ViewController () {
    NSArray *options;
}


@end

@implementation ViewController
@synthesize parallaxImageView;


- (void)viewDidLoad {
    [super viewDidLoad];
    options = [[NSArray alloc] initWithObjects:@"about.png",@"alerts.png",@"directory.png",@"locations.png",@"maps.png",@"services.png", nil];
    // Do any additional setup after loading the view, typically from a nib.
    
    //Values to control the depth of the effect horizontally
    CGFloat leftToRightMin = -20.0f;
    CGFloat leftToRightMax = 25.0f;
    
    //Values to control the depth of the effect vertically
    CGFloat upToDownMin = -30.0f;
    CGFloat upToDownMax = 35.0f;

    
    
    //Apply Motion effect
    UIInterpolatingMotionEffect *leftToright = [[UIInterpolatingMotionEffect alloc] initWithKeyPath:@"center.x" type:UIInterpolatingMotionEffectTypeTiltAlongHorizontalAxis];
    
    leftToright.minimumRelativeValue = @(leftToRightMin);
    leftToright.maximumRelativeValue = @(leftToRightMax);

    
    UIInterpolatingMotionEffect *upTodown = [[UIInterpolatingMotionEffect alloc] initWithKeyPath:@"center.y" type:UIInterpolatingMotionEffectTypeTiltAlongVerticalAxis];

    upTodown.minimumRelativeValue = @(upToDownMin);
    upTodown.maximumRelativeValue = @(upToDownMax);
    
    
    //Create a group and starting adding effects to this group
    UIMotionEffectGroup *parallaxEffectGroup = [[UIMotionEffectGroup alloc] init];
    parallaxEffectGroup.motionEffects = @[leftToright,upTodown];
    
    
    //Add the group to the image view where you want to see the parallax effect
    [parallaxImageView addMotionEffect:parallaxEffectGroup];
    
        
}

-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    
    // Should return the count of cells that needs to be populated
    return options.count;
}

-(UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    
    //Fill the collection view with the images
    UICollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"Cell" forIndexPath:indexPath];

    UIImageView *imgView = [[UIImageView alloc]init];
    [imgView setFrame:CGRectMake(0, 0, 100, 100)];
    imgView.image =[ UIImage imageNamed:[options objectAtIndex:indexPath.row]];
    [cell.contentView addSubview:imgView];
    
    
    return cell;
}


- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
  //Present the view/View controller on demand upon selection of an item
    [[NSNotificationCenter defaultCenter] postNotificationName:@"changeChild" object:nil userInfo:@{@"key": @"second"}];
    
    switch (indexPath.item) {
        case 0:
            [self performSegueWithIdentifier:@"about" sender:nil];
            break;
        case 1:
            [self performSegueWithIdentifier:@"services" sender:nil];
            break;
        case 2:
            [self performSegueWithIdentifier:@"directory" sender:nil];
            break;
        default:
            break;
    }

    
}

//Method to be sure enough that it removes all the pre-existing view from the memory
-(void) clearAllViewControllers{
    if([self.childViewControllers count] >1){
        for(int i =0; i <[self.childViewControllers count]; i++){
            UIViewController *vc  = [self.childViewControllers objectAtIndex:i];
            [vc willMoveToParentViewController:nil];
            [vc.view removeFromSuperview];
            [vc removeFromParentViewController];
            
        }
    }
}
 
//prepare for launching the required view/view controller
 -(void) prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([[segue identifier]isEqualToString:@"about"]) {
        NSLog(@"clicked about us cell");
        [self clearAllViewControllers];
        UIViewController *controller = [segue destinationViewController];
        [self addChildViewController:controller];
        controller.view.frame = self.view.bounds;
        [self.view addSubview:controller.view];
        [controller didMoveToParentViewController:self];
        
    } else if ([[segue identifier]isEqualToString:@"services"]) {
        NSLog(@"clicked services cell");
        
        [self clearAllViewControllers];
        UIViewController *controller = [segue destinationViewController];
        [self addChildViewController:controller];
        controller.view.frame = self.view.bounds;
        [self.view addSubview:controller.view];
        [controller didMoveToParentViewController:self];
    } else if ([[segue identifier]isEqualToString:@"directory"]) {
        NSLog(@"clicked directory cell");
        
        [self clearAllViewControllers];
        UIViewController *controller = [segue destinationViewController];
        [self addChildViewController:controller];
        controller.view.frame = self.view.bounds;
        [self.view addSubview:controller.view];
        [controller didMoveToParentViewController:self];
    }
     else {
        NSLog(@"clicked someother button");
         
         }
}



- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
