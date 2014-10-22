//
//  servicesViewController.m
//  SJMO
//
//  Created by Raghuveer Subodha on 06/10/14.
//  Copyright (c) 2014 Appcellence. All rights reserved.
//

#import "servicesViewController.h"
#import "servicesDetailedViewController.h"

@interface servicesViewController ()

@end

@implementation servicesViewController
{
    NSArray *servicesArray;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    servicesArray = [NSArray arrayWithObjects:@"Services 1", @"Services 2", @"Services 3", @"Services 4", @"Services 5", @"Services 6", @"Services 7", @"Services 8", @"Services 9", @"Services 10", @"Services 11", @"Services 12", @"Services 13", @"Services 14", @"Services 15", @"Services 16", @"Services 17", nil];
}

-(NSInteger) tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [servicesArray count];
}


-(UITableViewCell *) tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    static NSString *tableIdentifier = @"ServicesTable";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:tableIdentifier];
    
    if (cell == nil){
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:tableIdentifier];
    }
    cell.textLabel.text = [servicesArray objectAtIndex:indexPath.row];
   // cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;

    return cell;

}

//Created a seperate ViewController class called ServiceDetailedViewController and pushing that controller upon selection of a row

-(void) tableView:(UITableView *)tableView didDeselectRowAtIndexPath:(NSIndexPath *)indexPath {
    NSLog(@"Row clicked");
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
