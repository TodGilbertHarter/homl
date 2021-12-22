#!/bin/bash
# Argument is the name for the new key file.
gcloud iam service-accounts keys create $1 --iam-account=charactercreator@heroes-of-myth-and-legend.iam.gserviceaccount.com 
