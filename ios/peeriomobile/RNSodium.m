//
//  RNSodium
//  RNSodium
//
//  Created by Samvel Avanesov on 05/01/2017.
//  Copyright © 2017 Technologies Peerio Inc. All rights reserved.
//
#include <sys/types.h>
#include <sys/sysctl.h>
#include <React/RCTLog.h>
#import "RNSodium.h"

#include "libsodium-ios/include/sodium.h"

@implementation RNSodium

RCT_EXPORT_MODULE();

+ (void)initialize {
    int result = sodium_init();
    NSLog(@"RNSodium.m: sodium init %d", result);
}

RCT_REMAP_METHOD(scrypt,
    passwordB64:(NSString*)passwordB64
    saltB64:(NSString*)saltB64
    p_N: (nonnull NSNumber* )p_N
    p_r: (nonnull NSNumber* )p_r
    p_p: (nonnull NSNumber* )p_p
    p_dkLen: (nonnull NSNumber*)p_dkLen
    resolver: (RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject)
{
    NSData *password = [[NSData alloc] initWithBase64EncodedString:passwordB64 options:0];
    NSData *salt = [[NSData alloc] initWithBase64EncodedString:saltB64 options:0];
    unsigned long N = [p_N unsignedIntegerValue];
    unsigned int r = [p_r unsignedIntValue];
    unsigned int p = [p_p unsignedIntValue];
    unsigned int dkLen = [p_dkLen unsignedIntValue];
    NSMutableData *buffer = [NSMutableData dataWithLength:dkLen];
    int result = crypto_pwhash_scryptsalsa208sha256_ll(
      password.bytes, password.length,
      salt.bytes, salt.length,
      N, r, p,
      buffer.mutableBytes, buffer.length
    );
    if (result == 0) {
        NSString* resultB64 = [buffer base64Encoding];
        resolve(resultB64);
    } else {
        reject(@"RNSodium.m: scrypt error", nil, nil);
    }
}

@end
