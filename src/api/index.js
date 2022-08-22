// 项目接口模块

import request from '@/utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

// 获取所有的用户信息
export const reqUserList = query => request({url: '/user/getAllUser',method: 'post',data: query});

//根据id修改用户信息
export const reqEditUserById = form => request({url: '/user/editUserById', method: 'post', data: form});

//根据id数组删除用户
export const reqDeleteUserByIds = idList => request({url: '/user/deleteUserByIds', method: 'post', data: idList});

//获取所有的咨询师信息
export const reqConList = query => request({url: '/user/getAllCon', method: 'post', data: query});

//根据id数组删除用户咨询师资格
export const reqDeleteConByIds = idList => request({url: '/user/deleteConByIds', method: 'post', data: idList});

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

