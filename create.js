const fs = require("fs");
const path = require("path");

const dirs = ["xqsy", "xxs", "sghxq", "sgrj", "hcl"];
const groupNameMap = {
  xqsy: "闲情岁月",
  xxs: "小小说",
  sghxq: "时光幻想曲",
  sgrj: "时光日记",
  hcl: "红尘里",
};
const groupList = [];

// 创建目录文件
const createFile = () => {
  let content = `<!-- docs/_sidebar.md -->`;
  groupList.forEach((group) => {
    content += `\n\n- ${group.name}`;
    const list = group.list.map((item) => {
      const name = path.basename(item, ".md");
      return `  - [${name}](./${group.dir}/${item})`;
    });
    content += `\n\n${list.join("\n")}`;
  });
  fs.writeFileSync(path.join(__dirname, "./_sidebar.md"), content);
  console.log("目录创建完成");
};

// 启动编译
const run = () => {
  dirs.forEach((dir) => {
    const p = path.join(__dirname, "./" + dir);
    const list = fs.readdirSync(p);
    // 处理文件
    list.forEach((file) => {
      const filePath = path.join(__dirname, `./${dir}/`, file);
      const fileContent = fs.readFileSync(filePath, {
        encoding: "utf-8",
      });
      const rowList = fileContent.split("\n");
      let firstRow = rowList[0];
      let secondRow = rowList[1];
      if (!/^#/.test(firstRow)) {
        firstRow = "# " + firstRow;
        secondRow = "> " + secondRow;
        const newFileContent = [
          firstRow,
          "",
          secondRow,
          "",
          ...rowList.slice(2),
        ].join("\n");
        fs.writeFileSync(filePath, newFileContent);
      }
    });
    // 收集文件列表
    groupList.push({
      dir,
      name: groupNameMap[dir],
      list,
    });
  });
  createFile();
};

run();
