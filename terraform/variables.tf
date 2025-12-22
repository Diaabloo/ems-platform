variable "location" {
  description = "Azure region"
  type        = string
  default     = "norwayeast"
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
  default = "rg-ems-platform"
}

variable "vnet_name" {
  description = "Virtual network name"
  type        = string
  default = "vnet-ems"
}

variable "vm_name" {
  default = "vm-ems-prod"
}

variable "vm_size" {
  description = "Taille de la VM (Standard_B2s est parfait)"
  type        = string
  default     = "Standard_B2s"
}

variable "admin_username" {
  default = "amine"
}

variable "ssh_public_key_path" {
  default = "~/.ssh/id_rsa.pub"
}

variable "tags" {
  type = map(string)
  default = {
    project = "ems-platform"
    owner   = "amine"
  }
}