// 项目接口模块

import request from '@/utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

//管理员登录验证
export const reqLogin = query => request({url: '/admin/toLogin',method:'post', data: query});

//管理员登录验证
export const reqEditAdmin = query => request({url: '/admin/editAdmin',method:'post', data: query});

// 获取所有的用户信息
export const reqUserList = query => request({url: '/user/getAllUser',method: 'post',data: query});
//根据id修改用户信息
export const reqEditUserById = form => request({url: '/user/editUserById', method: 'post', data: form});
//根据id数组删除用户
export const reqDeleteUserByIds = idList => request({url: '/user/deleteUserByIds', method: 'post', data: idList});

//获取所有的咨询师信息
export const reqConList = query => request({url: '/con/getAllCons', method: 'post', data: query});
//根据id数组删除咨询师
export const reqDeleteConByIds = idList => request({url: '/con/deleteConByIds', method: 'post', data: idList});
//根据id修改咨询师信息
export const reqEditConById = form => request({url: '/con/editConById', method: 'post', data: form});

// 获取所有的文章信息
export const reqEssayList = query => request({url: '/essay/getEssayList',method: 'post',data: query});
//根据id修改文章信息
export const reqEditEssayById = form => request({url: '/essay/editEssayById', method: 'post', data: form});
//根据id数组删除文章
export const reqDeleteEssayByIds = idList => request({url: '/essay/deleteEssayByIds', method: 'post', data: idList});

// 获取所有的评论信息
export const reqCommentsList = query => request({url: '/comments/getAllComments',method: 'post',data: query});

//根据id修改评论信息
export const reqEditCommentsById = commentsId => request({url: `/comments/editCommentsById/${commentsId}`, method: 'get'});

//根据id数组删除评论
export const reqDeleteCommentsByIds = idList => request({url: '/comments/deleteCommentsByIds', method: 'post', data: idList});

// 获取所有的提问信息
export const reqQuestionList = query => request({url: '/question/getQuestionList',method: 'post',data: query});

//根据id修改提问信息
export const reqEditQuestionById = question => request({url: `/question/editQuestionById`,method: 'post', data: question});

//根据id数组删除提问
export const reqDeleteQuestionByIds = idList => request({url: '/question/deleteQuestionByIds', method: 'post', data: idList});

// 获取所有的回复信息
export const reqAnswerList = query => request({url: '/answer/getAnswerList',method: 'post',data: query});

//根据id修改回复信息
export const reqEditAnswerById = id => request({url: `/answer/editAnswerById/${id}`, method: 'get'});

//根据id数组删除回复
export const reqDeleteAnswerByIds = idList => request({url: '/answer/deleteAnswerByIds', method: 'post', data: idList});

// 获取所有的测试信息
export const reqTestList = query => request({url: '/test/getTestList',method: 'post',data: query});

// 获取所有的测试类别
export const reqTestLabel = () => request({url: '/test/getLabelList',method: 'post'});

//根据id修改测试信息
export const reqEditTestById = param => request({url: `/test/editTestById`,method: 'post', data: param});

//根据id数组删除测试
export const reqDeleteTestByIds = idList => request({url: '/test/deleteTestByIds', method: 'post', data: idList});

//获取所有的测评结果信息
export const reqTestRList = query => request({url: '/test/getTestRList',method: 'post',data: query});

//根据id修改测评结果信息
export const reqEditTestRById = param => request({url: `/test/editTestRById`,method: 'post', data: param});

//根据id数组删除测评结果
export const reqDeleteTestRByIds = idList => request({url: '/test/deleteTestRByIds', method: 'post', data: idList});

//获取所有的测评结果信息
export const reqTestAList = query => request({url: `/test/getTestQuesAndAns/`,method: 'post',data: query});

// 添加问卷
export const reqAddTest = query => request({url: '/test/addTest',method: 'post',data: query});

//根据id修改测评问卷题目和选项内容
export const reqEditTestQAndAById = param => request({url: `/test/editTestQAndAById`,method: 'post', data: param});

//根据id数组删除测试
export const reqDeleteTestQAndAByIds = idList => request({url: '/test/deleteTestQAndAByIds', method: 'post', data: idList});

//获取所有的测评规则信息
export const reqTestRuList = query => request({url: '/test/getTestRuList',method: 'post',data: query});

//根据id修改测评规则信息
export const reqEditTestRuById = param => request({url: `/test/editTestRuById`,method: 'post', data: param});

//根据id增加测评规则信息
export const reqAddTestRu = param => request({url: `/test/addTestRu`,method: 'post', data: param});

//根据id数组删除规则结果
export const reqDeleteTestRuByIds = idList => request({url: '/test/deleteTestRuByIds', method: 'post', data: idList});

//获取所有的公告信息
export const reqNoticeList = status => request({url: `/sys/getNoticeList/${status}`,method: 'get'});

//根据id修改公告信息
export const reqEditNoticeById = param => request({url: `/sys/editNoticeById`,method: 'post', data: param});

//根据id增加公告信息
export const reqaddNotice = param => request({url: `/sys/addNotice`,method: 'post', data: param});

//根据id数组删除公告
export const reqDeleteNoticeById = idList => request({url: '/sys/deleteNoticeById', method: 'post', data: idList});

