# Why is this necessary?

## Theory

This module allows you to convert any files into vue components. In order to make these files pleasant to view in the browser.

## Practice

I made this module for my [VDocs](https://lentryd.su/VDocs/) project. I just didn't want to clutter up the main project with this function and I made a separate module.

# How does it work?

## Module

### Installation

```bash
npm i vdocs-vue -s
```

### Usage

#### Download the repository and convert the files.

> It is not necessary to install git, but it is recommended.

```typescript
import file2vue from "vdocs-vue";

const options = {
  owner: "lentryd", // Your github username
  repository: "VDocs-vue", // Repository name
  folder: "./pages", // The path of the folder where you want to save the file. (You can not specify it)
  branch: "main", // The branch of the repository. (You can not specify it)
};

file2vue(options); // An array with the data of the modified files.
```

#### Edit files that have already been downloaded.

```typescript
import file2vue from "vdocs-vue";

const options = {
  folder: "./pages", // The path to the folder with the downloaded files.
};

file2vue(options); // An array with the data of the modified files.
```

## Bash script

### Installation

```bash
npm i vdocs-vue -g
```

### Check

```bash
vdocs-vue -h
```

### Usage

#### Download the repository and convert the files.

> It is not necessary to install git, but it is recommended.

```bash
vdocs-vue -o lentryd -r VDocs-vue -f ./pages -b main
```

> The `-f` and `-b` parameters can be omitted.

#### Edit files that have already been downloaded.

If another directory is open.

```bash
vdocs-vue -f ./pages
```

If the directory with the files for changes is open.

```bash
vdocs-vue
```
