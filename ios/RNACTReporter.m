//
//  RNACTReporter
//  RNACTReporter
//
//  Created by Samvel Avanesov
//  Copyright © 2017 Technologies Peerio Inc. All rights reserved.
//
#include <sys/types.h>
#include <sys/sysctl.h>
#include <React/RCTLog.h>
#include "include/ACTReporter.h"
#include "RNACTReporter.h"

@implementation RNACTReporter

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(trackInstall,
    conversionID:(NSString*)conversionID
    conversionLabel:(NSString*)conversionLabel
    resolver: (RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject)
{
    [ACTConversionReporter reportWithConversionID:conversionID label:conversionLabel value:@"0.00" isRepeatable:YES];
    resolve([NSNumber numberWithInt:1]);
}

@end
