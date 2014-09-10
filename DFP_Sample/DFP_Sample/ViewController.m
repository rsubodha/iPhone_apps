//
//  ViewController.m
//  DFP_Sample
//
//  Created by Raghuveer Subodha on 09/09/14.
//  Copyright (c) 2014 Appcellence. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController
            
- (void)viewDidLoad {
    [super viewDidLoad];
    _pageTitles = @[@"Electronics",@"Cosmetics",@"Chocolates",@"LifeStyle"];
    _pageImages = @[@"categoryPage1.png",@"categoryPage2.png",@"categoryPage3.png",@"categoryPage4.png"];
    // Do any additional setup after loading the view, typically from a nib.
    
    
    self.pageViewController =[self.storyboard instantiateViewControllerWithIdentifier:@"PageViewController"];
    self.pageViewController.dataSource = self;
    
    PageContentViewController *startingViewController = [self viewControllerAtIndex:0];
    NSArray *viewController = @[startingViewController];
    [self.pageViewController setViewControllers:viewController direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
    
    self.pageViewController.view.frame = CGRectMake(0,0, self.view.frame.size.width, self.view.frame.size.height - 30);
    
    [self addChildViewController:_pageViewController];
    [self.view addSubview:_pageViewController.view];
    [self.pageViewController didMoveToParentViewController:self];
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(UIViewController *) pageViewController:(UIPageViewController *)pageViewController viewControllerBeforeViewController:(UIViewController *)viewController {
    NSUInteger index = ((PageContentViewController*)viewController).pageIndex;
    
    if ((index==0)||(index ==NSNotFound)) {
        return nil;
    }
    
    index--;
    
    return [self viewControllerAtIndex:index];
    
}

-(UIViewController *) pageViewController:(UIPageViewController *)pageViewController viewControllerAfterViewController:(UIViewController *)viewController {
    NSUInteger index = ((PageContentViewController*)viewController).pageIndex;
    
    if (index ==NSNotFound) {
        return nil;
    }
    
    index++;
    
    if (index == [self.pageTitles count]) {
        return nil;
    }
    
    return [self viewControllerAtIndex:index];
    
}


-(PageContentViewController *) viewControllerAtIndex:(NSUInteger)index {
    
    if(([self.pageTitles count]==0)||(index>=[self.pageTitles count])) {
        return nil;
    }
    
    PageContentViewController *PageContentViewController = [self.storyboard instantiateViewControllerWithIdentifier:@"PageContentViewController"];
    PageContentViewController.imageFile = self.pageImages[index];
    PageContentViewController.titleText = self.pageTitles[index];
    PageContentViewController.pageIndex=index;
    
    return PageContentViewController;
}

-(NSInteger) presentationCountForPageViewController:(UIPageViewController *)pageViewController {
    return [self.pageTitles count];
}

-(NSInteger) presentationIndexForPageViewController:(UIPageViewController *)pageViewController {
    return 0;
}

- (IBAction)startWalkThrough:(id)sender {
    
    PageContentViewController *startingViewController = [self viewControllerAtIndex:0];
    NSArray *viewControllers = @[startingViewController];
    [self.pageViewController setViewControllers:viewControllers direction:UIPageViewControllerNavigationDirectionReverse animated:NO completion:nil];
}
@end
